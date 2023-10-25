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

import java.util.HashSet;
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

      Product product = modelMapper.map(productDTO, Product.class);

      product = productRepository.save(product);
      if(file != null){
         String url = fileService.uploadFile(file);
         Media media = Media.builder().url(url).build();
         Set<Media> media1=new HashSet<>();
         product.setImages(media1);
         media1.add(media);
         productRepository.save(product);
      }
      return modelMapper.map(product, ProductDTO.class);
   }

   @Override
   public ProductDTO updateProduct(int id,ProductDTO productDTO) {
      Product existingProduct = productRepository.findById(id)
              .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

      existingProduct.setName(productDTO.getName());
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
