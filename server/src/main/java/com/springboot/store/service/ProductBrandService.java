package com.springboot.store.service;

import com.springboot.store.payload.ProductBrandDTO;
import com.springboot.store.payload.ProductDTO;
import org.springframework.stereotype.Service;

import java.util.List;
public interface ProductBrandService {
    ProductBrandDTO getProductBrandById(int id);
    List<ProductBrandDTO> getAllProductBrands();
    List<ProductDTO> getAllProductsByProductBrandId(int id);
    ProductBrandDTO createProductBrand(ProductBrandDTO productBrandDTO);
    ProductBrandDTO updateProductBrand(int id, ProductBrandDTO productBrandDTO);
    void deleteProductBrand(int id);
}
