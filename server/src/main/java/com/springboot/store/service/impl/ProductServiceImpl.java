package com.springboot.store.service.impl;

import com.springboot.store.entity.*;
import com.springboot.store.payload.ProductDTO;
import com.springboot.store.repository.MediaRepository;
import com.springboot.store.repository.ProductRepository;
import com.springboot.store.service.FileService;
import com.springboot.store.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final MediaRepository mediaRepository;
    private final ModelMapper modelMapper;
    private final FileService fileService;


    @Override
    public ProductDTO getProductById(int id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        return modelMapper.map(product, ProductDTO.class);
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO createProduct(MultipartFile file, ProductDTO productDTO) {

        Product product = modelMapper.map(productDTO, Product.class);

        product = productRepository.save(product);
        if (file != null) {
            String url = fileService.uploadFile(file);
            Media media = Media.builder().url(url).build();
            List<Media> media1 = new ArrayList<>();
            product.setImages(media1);
            media1.add(media);
            productRepository.save(product);
        }
        return modelMapper.map(product, ProductDTO.class);
    }

    @Override
    public ProductDTO updateProduct(int id, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        existingProduct.setName(productDTO.getName());
        existingProduct.setBarcode(productDTO.getBarcode());
        existingProduct.setProperty(productDTO.getProperty());
        existingProduct.setLocation(productDTO.getLocation());
        existingProduct.setQuantity(productDTO.getQuantity());
        existingProduct.setStatus(productDTO.getStatus());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setNote(productDTO.getNote());
        existingProduct.setMinStock(productDTO.getMinStock());
        existingProduct.setMaxStock(productDTO.getMaxStock());

        if (productDTO.getOriginalPrice() != existingProduct.getOriginalPrices().get(existingProduct.getOriginalPrices().size() - 1).getValue()) {
            existingProduct.getOriginalPrices().add(OriginalPrice.builder()
                            .value(productDTO.getOriginalPrice())
                            .createdAt(new Date())
                            .build());
        }

        if (productDTO.getProductPrice() != existingProduct.getProductPrices().get(existingProduct.getProductPrices().size() - 1).getValue()) {
            existingProduct.getProductPrices().add(ProductPrice.builder()
                            .value(productDTO.getProductPrice())
                            .createdAt(new Date())
                            .build());
        }

        if (productDTO.getSalesUnits() != null) {
            existingProduct.getSalesUnits().setName(productDTO.getSalesUnits().getName());
            existingProduct.getSalesUnits().setBasicUnit(productDTO.getSalesUnits().getBasicUnit());
            existingProduct.getSalesUnits().setExchangeValue(productDTO.getSalesUnits().getExchangeValue());
        }

        
//        List<String> mediaDTOs = productDTO.getImages();
//        if (mediaDTOs != null && !mediaDTOs.isEmpty()) {
//            List<Media> mediaEntities = mediaDTOs.stream()
//                    .map(mediaDTO -> mediaRepository.findByUrl(mediaDTO)
//                            .orElseThrow(() -> new EntityNotFoundException("Media not found with url: " + mediaDTO)))
//                    .collect(Collectors.toSet());
//            existingProduct.setImages(mediaEntities);
//        }


        existingProduct = productRepository.save(existingProduct);
        return modelMapper.map(existingProduct, ProductDTO.class);

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
