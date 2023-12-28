package com.springboot.store.service.impl;

import com.springboot.store.entity.*;
import com.springboot.store.mapper.ProductMapper;
import com.springboot.store.payload.ProductDTO;
import com.springboot.store.repository.*;
import com.springboot.store.service.FileService;
import com.springboot.store.service.ProductService;
import com.springboot.store.service.StaffService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

// updated store
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductPropertyNameRepository productPropertyNameRepository;
    private final ProductGroupRepository productGroupRepository;
    private final LocationRepository locationRepository;
    private final ProductBrandRepository productBrandRepository;
    private final StaffService staffService;
    private final FileService fileService;

    @Override
    public ProductDTO getProductById(int id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        return ProductMapper.toProductDTO(product);
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<Product> products = productRepository.findByStoreId(storeId);
        return products.stream()
                .map(ProductMapper::toProductDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> createProduct(MultipartFile[] files, List<ProductDTO> productDTOs) {
        List<ProductDTO> productResponse = new ArrayList<>();
        Staff staff = staffService.getAuthorizedStaff();
        for (ProductDTO productDTO : productDTOs) {
            Product product = ProductMapper.toProduct(productDTO);

            if (productDTO.getLocation() != null) {
                Location location = locationRepository.findByNameAndStoreId(productDTO.getLocation(), staff.getStore().getId())
                        .orElseThrow(() -> new EntityNotFoundException("Location not found with name: " + productDTO.getLocation()));
                product.setLocation(location);
            }

            if (productDTO.getProductGroup() != null) {
                ProductGroup productGroup = productGroupRepository.findByNameAndStoreId(productDTO.getProductGroup(), staff.getStore().getId())
                        .orElseThrow(() -> new EntityNotFoundException("Product group not found with name: " + productDTO.getProductGroup()));
                product.setProductGroup(productGroup);
            }

            if (productDTO.getProductBrand() != null) {
                ProductBrand productBrand = productBrandRepository.findByNameAndStoreId(productDTO.getProductBrand(), staff.getStore().getId())
                        .orElseThrow(() -> new EntityNotFoundException("Product brand not found with name: " + productDTO.getProductBrand()));
                product.setProductBrand(productBrand);
            }

            product.setOriginalPrices(Collections.singletonList(OriginalPrice.builder()
                    .value(productDTO.getOriginalPrice())
                    .createdAt(new Date())
                    .build()));

            product.setProductPrices(Collections.singletonList(ProductPrice.builder()
                    .value(productDTO.getProductPrice())
                    .createdAt(new Date())
                    .build()));

            if (files != null) {
                List<Media> urls = new ArrayList<>();
                for (MultipartFile file : files) {
                    String url = fileService.uploadFile(file);
                    if (url == null) continue;
                    Media media = Media.builder().url(url).build();
                    urls.add(media);
                }
                if (!urls.isEmpty())
                    product.setImages(urls);
            }

            if (productDTO.getProductProperties() != null) {
                List<ProductProperty> productProperties = productDTO.getProductProperties().stream()
                        .map(productPropertyDTO -> ProductProperty.builder()
                                .propertyName(productPropertyNameRepository.findByNameAndStoreId(productPropertyDTO.getPropertyName(), staff.getStore().getId())
                                        .orElseThrow(() -> new EntityNotFoundException("Product property name not found with name: " + productPropertyDTO.getPropertyName())))
                                .propertyValue(productPropertyDTO.getPropertyValue())
                                .build())
                        .collect(Collectors.toList());
                product.setProperties(productProperties);
            }

            if (productDTO.getSalesUnits() != null) {
                SalesUnits salesUnits = SalesUnits.builder()
                        .name(productDTO.getSalesUnits().getName())
                        .basicUnit(productDTO.getSalesUnits().getBasicUnit())
                        .exchangeValue(productDTO.getSalesUnits().getExchangeValue())
                        .store(staff.getStore())
                        .build();
                product.setSalesUnits(salesUnits);
            }
            product.setStore(staff.getStore());
            productRepository.save(product);
            productResponse.add(ProductMapper.toProductDTO(product));
        }
        return productResponse;
    }

    @Override
    public ProductDTO updateProduct(int id, MultipartFile[] files, ProductDTO productDTO) {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        existingProduct.setName(productDTO.getName());
        existingProduct.setBarcode(productDTO.getBarcode());
        existingProduct.setStock(productDTO.getStock());
        existingProduct.setWeight(productDTO.getWeight());
        existingProduct.setStatus(productDTO.getStatus());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setNote(productDTO.getNote());
        existingProduct.setMinStock(productDTO.getMinStock());
        existingProduct.setMaxStock(productDTO.getMaxStock());

        // location
        if (productDTO.getLocation() != null) {
            Location location = locationRepository.findByNameAndStoreId(productDTO.getLocation(), storeId)
                    .orElseThrow(() -> new EntityNotFoundException("Location not found with name: " + productDTO.getLocation()));
            existingProduct.setLocation(location);
        }

        // product group
        if (productDTO.getProductGroup() != null) {
            ProductGroup productGroup = productGroupRepository.findByNameAndStoreId(productDTO.getProductGroup(), storeId)
                    .orElseThrow(() -> new EntityNotFoundException("Product group not found with name: " + productDTO.getProductGroup()));
            existingProduct.setProductGroup(productGroup);
        }

        // product brand
        if (productDTO.getProductBrand() != null) {
            ProductBrand productBrand = productBrandRepository.findByNameAndStoreId(productDTO.getProductBrand(), storeId)
                    .orElseThrow(() -> new EntityNotFoundException("Product brand not found with name: " + productDTO.getProductBrand()));
            existingProduct.setProductBrand(productBrand);
        }

        // original price
        if (productDTO.getOriginalPrice() != existingProduct.getOriginalPrices().get(existingProduct.getOriginalPrices().size() - 1).getValue()) {
            existingProduct.getOriginalPrices().add(OriginalPrice.builder()
                    .value(productDTO.getOriginalPrice())
                    .createdAt(new Date())
                    .build());
        }

        // product price
        if (productDTO.getProductPrice() != existingProduct.getProductPrices().get(existingProduct.getProductPrices().size() - 1).getValue()) {
            existingProduct.getProductPrices().add(ProductPrice.builder()
                    .value(productDTO.getProductPrice())
                    .createdAt(new Date())
                    .build());
        }

        // sale unit
        if (productDTO.getSalesUnits() != null) {
            existingProduct.getSalesUnits().setName(productDTO.getSalesUnits().getName());
            existingProduct.getSalesUnits().setBasicUnit(productDTO.getSalesUnits().getBasicUnit());
            existingProduct.getSalesUnits().setExchangeValue(productDTO.getSalesUnits().getExchangeValue());
        }

        // images
        existingProduct.getImages().removeIf(media -> !productDTO.getImages().contains(media.getUrl()));

        if (files != null) {
            for (MultipartFile file : files) {
                String url = fileService.uploadFile(file);
                if (url == null) continue;
                Media media = Media.builder().url(url).build();
                existingProduct.getImages().add(media);
            }
        }


        // product properties
        if (productDTO.getProductProperties() != null) {
            List<ProductProperty> productProperties = productDTO.getProductProperties().stream()
                    .map(productPropertyDTO -> ProductProperty.builder()
                            .propertyName(productPropertyNameRepository.findByNameAndStoreId(productPropertyDTO.getPropertyName(), storeId)
                                    .orElseThrow(() -> new EntityNotFoundException("Product property name not found with name: " + productPropertyDTO.getPropertyName())))
                            .propertyValue(productPropertyDTO.getPropertyValue())
                            .build())
                    .collect(Collectors.toList());
            existingProduct.setProperties(productProperties);
        }


        existingProduct = productRepository.save(existingProduct);
        return ProductMapper.toProductDTO(existingProduct);

    }

    @Override
    public void deleteProduct(int id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        product.setIsDeleted(true);
        productRepository.save(product);
    }

    @Override
    public void deleteAllProducts() {
        productRepository.deleteAll();
    }

    @Override
    public Map<Integer, Product> getAllProductMap() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<Product> products = productRepository.findByStoreId(storeId);
        Map<Integer, Product> productMap = new HashMap<>();
        for (Product product : products) {
            productMap.put(product.getId(), product);
        }
        return productMap;
    }

}
