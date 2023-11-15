package com.springboot.store.service;

import com.springboot.store.payload.ProductDTO;
import com.springboot.store.payload.ProductGroupDTO;

import java.util.List;

public interface ProductGroupService {
    ProductGroupDTO getProductGroupById(int id);
    List<ProductGroupDTO> getAllProductGroups();
    List<ProductDTO> getAllProductsByProductGroupId(int id);
    ProductGroupDTO createProductGroup(ProductGroupDTO productGroupDTO);
    ProductGroupDTO updateProductGroup(int id, ProductGroupDTO productGroupDTO);
    void deleteProductGroup(int id);
}
