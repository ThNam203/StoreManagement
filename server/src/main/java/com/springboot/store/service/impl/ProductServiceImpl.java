package com.springboot.store.service.impl;

import com.springboot.store.entity.Product;
import com.springboot.store.payload.ProductDTO;
import com.springboot.store.repository.ProductRepository;
import com.springboot.store.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {
   private final ProductRepository productRepository;
   private final ModelMapper modelMapper;
   @Autowired
   public ProductServiceImpl(ProductRepository productRepository, ModelMapper modelMapper) {
       this.productRepository = productRepository;
       this.modelMapper = modelMapper;
   }

   @Override
   public ProductDTO getProductById(int id) {
      Product product = productRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Product not found with id: " + id));
      return modelMapper.map(product,ProductDTO.class);
   }

   @Override
   public List<ProductDTO> getAllProducts() {
      List<Product> products = productRepository.findAll();
      return products.stream()
              .map(product -> modelMapper.map(product, ProductDTO.class))
              .collect(Collectors.toList());
   }

   @Override
   public ProductDTO createProduct(ProductDTO productDTO) {
      Product product = modelMapper.map(productDTO, Product.class);
      product = productRepository.save(product);
      return modelMapper.map(product, ProductDTO.class);
   }

   @Override
   public ProductDTO updateProduct(int id,ProductDTO productDTO) {
      Product existingProduct = productRepository.findById(id)
              .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

      // Update existingProduct with data from productDTO
      existingProduct.setName(productDTO.getName());
      // Update other fields as needed

      existingProduct = productRepository.save(existingProduct);
      return modelMapper.map(existingProduct, ProductDTO.class);
   }

   @Override
   public void deleteProduct(int id) {
      productRepository.deleteById(id);
   }
}
