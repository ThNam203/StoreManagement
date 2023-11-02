package com.springboot.store.service;

import com.springboot.store.payload.ProductPropertyDTO;

import java.util.List;

public interface ProductPropertyService {
    ProductPropertyDTO getProductPropertyById(int id);

    List<ProductPropertyDTO> getAllProductProperties();

    ProductPropertyDTO createProductProperty(ProductPropertyDTO productPropertyDTO);

    ProductPropertyDTO updateProductProperty(int id, ProductPropertyDTO productPropertyDTO);

    void deleteProductProperty(int id);
}
