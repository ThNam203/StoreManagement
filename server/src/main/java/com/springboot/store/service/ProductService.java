package com.springboot.store.service;

import com.springboot.store.entity.Location;
import com.springboot.store.entity.Product;
import com.springboot.store.payload.ProductDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    ProductDTO getProductById(int id);

    List<ProductDTO> getAllProducts();

    ProductDTO createProduct(MultipartFile[] files, ProductDTO productDTO);

    ProductDTO updateProduct(int id, MultipartFile[] files, ProductDTO productDTO);

    void deleteProduct(int id);

    void deleteAllProducts();
}
