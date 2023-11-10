package com.springboot.store.service.impl;

import com.springboot.store.entity.*;
import com.springboot.store.mapper.ProductMapper;
import com.springboot.store.payload.ProductDTO;
import com.springboot.store.repository.*;
import com.springboot.store.service.FileService;
import com.springboot.store.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductPropertyNameRepository productPropertyNameRepository;
    private final ProductGroupRepository productGroupRepository;
    private final LocationRepository locationRepository;
    private final ProductBrandRepository productBrandRepository;
    private final FileService fileService;



    @Override
    public ProductDTO getProductById(int id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        return ProductMapper.toProductDTO(product);
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(ProductMapper::toProductDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO createProduct(MultipartFile[] files, ProductDTO productDTO) {

        Product product = ProductMapper.toProduct(productDTO);

        if (productDTO.getLocation() != null) {
            product.setLocation(Location.builder()
                    .name(productDTO.getLocation())
                    .build());
        }

        if (productDTO.getProductGroup() != null) {
            ProductGroup productGroup = productGroupRepository.findByName(productDTO.getProductGroup())
                    .orElseThrow(() -> new EntityNotFoundException("Product group not found with name: " + productDTO.getProductGroup()));
            product.setProductGroup(productGroup);
        }

        if (productDTO.getProductBrand() != null) {
            ProductBrand productBrand = productBrandRepository.findByName(productDTO.getProductBrand())
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
                Media media = Media.builder().url(url).build();
                urls.add(media);
            }
            product.setImages(urls);
        }

        if (productDTO.getProductProperties() != null) {
            List<ProductProperty> productProperties = productDTO.getProductProperties().stream()
                    .map(productPropertyDTO -> ProductProperty.builder()
                            .propertyName(productPropertyNameRepository.findByName(productPropertyDTO.getPropertyName())
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
                    .build();
            product.setSalesUnits(salesUnits);
        }

        productRepository.save(product);
        return ProductMapper.toProductDTO(product);
    }

    @Override
    public ProductDTO updateProduct(int id, MultipartFile[] files, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        existingProduct.setName(productDTO.getName());
        existingProduct.setBarcode(productDTO.getBarcode());
        existingProduct.setStock(productDTO.getStock());
        existingProduct.setStatus(productDTO.getStatus());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setNote(productDTO.getNote());
        existingProduct.setMinStock(productDTO.getMinStock());
        existingProduct.setMaxStock(productDTO.getMaxStock());

        // location
        if (productDTO.getLocation() != null) {
            Location location = locationRepository.findByName(productDTO.getLocation())
                    .orElseThrow(() -> new EntityNotFoundException("Location not found with name: " + productDTO.getLocation()));
            existingProduct.setLocation(location);
        }

        // product group
        if (productDTO.getProductGroup() != null) {
            ProductGroup productGroup = productGroupRepository.findByName(productDTO.getProductGroup())
                    .orElseThrow(() -> new EntityNotFoundException("Product group not found with name: " + productDTO.getProductGroup()));
            existingProduct.setProductGroup(productGroup);
        }

        // product brand
        if (productDTO.getProductBrand() != null) {
            ProductBrand productBrand = productBrandRepository.findByName(productDTO.getProductBrand())
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
        if (files != null) {
            List<Media> urls = new ArrayList<>();
            for (MultipartFile file : files) {
                String url = fileService.uploadFile(file);
                Media media = Media.builder().url(url).build();
                urls.add(media);
            }
            existingProduct.setImages(urls);
        }


        // product properties
        if (productDTO.getProductProperties() != null) {
            List<ProductProperty> productProperties = productDTO.getProductProperties().stream()
                    .map(productPropertyDTO -> ProductProperty.builder()
                            .propertyName(productPropertyNameRepository.findByName(productPropertyDTO.getPropertyName())
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
        productRepository.deleteById(id);
    }

    @Override
    public void deleteAllProducts() {
        productRepository.deleteAll();
    }

}
