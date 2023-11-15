package com.springboot.store.service;

import com.springboot.store.payload.ProductPropertyNameDTO;

import java.util.List;

public interface ProductPropertyNameService {
    List<ProductPropertyNameDTO> getAllProductPropertyNames();
    ProductPropertyNameDTO getProductPropertyNameById(int id);
    ProductPropertyNameDTO createProductPropertyName(ProductPropertyNameDTO productPropertyNameDTO);
    ProductPropertyNameDTO updateProductPropertyName(int id, ProductPropertyNameDTO productPropertyNameDTO);
    void deleteProductPropertyName(int id);
}
