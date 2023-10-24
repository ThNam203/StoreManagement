package com.springboot.store.service.impl;

import com.springboot.store.entity.Media;
import com.springboot.store.entity.Product;
import com.springboot.store.payload.MediaDTO;
import com.springboot.store.payload.ProductDTO;
import com.springboot.store.repository.ProductRepository;
import com.springboot.store.service.FileService;
import com.springboot.store.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {
   private final ProductRepository productRepository;
   private final ModelMapper modelMapper;
   private final FileService fileService;
   @Autowired
   public ProductServiceImpl(ProductRepository productRepository, ModelMapper modelMapper, FileService fileService) {
       this.productRepository = productRepository;
       this.modelMapper = modelMapper;
       this.fileService = fileService;
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
   public ProductDTO createProduct(ProductDTO productDTO, MultipartFile file) {
      if (file != null && !file.isEmpty()) {
         // Upload file and get the image URL from FileService
         String imageUrl = fileService.uploadFile(file);

         // Create a new MediaDTO with the provided URL
         MediaDTO mediaDTO = new MediaDTO();
         mediaDTO.setUrl(imageUrl);

         // Add the mediaDTO to the product's images set
         productDTO.getImages().add(mediaDTO);
      }

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
      existingProduct.setBarcode(productDTO.getBarcode());
      existingProduct.setLocation(productDTO.getLocation());
      existingProduct.setOriginalPrice(productDTO.getOriginalPrice());
      existingProduct.setSellingPrice(productDTO.getSellingPrice());
      existingProduct.setQuantity(productDTO.getQuantity());
      existingProduct.setStatus(productDTO.getStatus());
      existingProduct.setDescription(productDTO.getDescription());
      existingProduct.setNote(productDTO.getNote());
      existingProduct.setMinQuantity(productDTO.getMinQuantity());
      existingProduct.setMaxQuantity(productDTO.getMaxQuantity());

      Set<MediaDTO> mediaDTOs = productDTO.getImages();
      if (mediaDTOs != null && !mediaDTOs.isEmpty()) {
         Set<Media> mediaEntities = mediaDTOs.stream()
                 .map(mediaDTO -> modelMapper.map(mediaDTO, Media.class))
                 .collect(Collectors.toSet());
         existingProduct.setImages(mediaEntities);
      }

      existingProduct = productRepository.save(existingProduct);
      return modelMapper.map(existingProduct, ProductDTO.class);

   }

   @Override
   public void deleteProduct(int id) {
      productRepository.deleteById(id);
   }
}
