package com.springboot.store.controller;

import com.springboot.store.payload.ProductBrandDTO;
import com.springboot.store.service.ProductBrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-brands")
public class ProductBrandController {
    private final ProductBrandService productBrandService;

    @Autowired
    public ProductBrandController(ProductBrandService productBrandService) {
        this.productBrandService = productBrandService;
    }

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

    @PostMapping("/create")
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
}
