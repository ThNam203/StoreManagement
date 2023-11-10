package com.springboot.store.controller;

import com.springboot.store.payload.ProductBrandDTO;
import com.springboot.store.payload.ProductDTO;
import com.springboot.store.service.ProductBrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-brands")
@RequiredArgsConstructor
public class ProductBrandController {
    private final ProductBrandService productBrandService;

    @GetMapping("/{productBrandId}")
    public ResponseEntity<ProductBrandDTO> getProductBrandById(@PathVariable int productBrandId) {
        ProductBrandDTO productBrandDTO = productBrandService.getProductBrandById(productBrandId);
        return ResponseEntity.ok(productBrandDTO);
    }

    @GetMapping
    public ResponseEntity<List<ProductBrandDTO>> getAllProductBrands() {
        List<ProductBrandDTO> productBrands = productBrandService.getAllProductBrands();
        return ResponseEntity.ok(productBrands);
    }

    @PostMapping
    public ResponseEntity<ProductBrandDTO> createProductBrand(@RequestBody ProductBrandDTO productBrandDTO) {
        ProductBrandDTO createdProductBrand = productBrandService.createProductBrand(productBrandDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProductBrand);
    }

    @PutMapping("/{productBrandId}")
    public ResponseEntity<ProductBrandDTO> updateProductBrand(
            @PathVariable int productBrandId,
            @RequestBody ProductBrandDTO productBrandDTO
    ) {
        ProductBrandDTO updatedProductBrand = productBrandService.updateProductBrand(productBrandId, productBrandDTO);
        return ResponseEntity.ok(updatedProductBrand);
    }

    @DeleteMapping("/{productBrandId}")
    public ResponseEntity<Void> deleteProductBrand(@PathVariable int productBrandId) {
        productBrandService.deleteProductBrand(productBrandId);
        return ResponseEntity.noContent().build();
    }

    // get all products by brand id
    @GetMapping("/{productBrandId}/products")
    public ResponseEntity<List<ProductDTO>> getAllProductsByProductBrandId(@PathVariable int productBrandId) {
        List<ProductDTO> products = productBrandService.getAllProductsByProductBrandId(productBrandId);
        return ResponseEntity.ok(products);
    }
}
