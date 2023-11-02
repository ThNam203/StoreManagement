package com.springboot.store.controller;

import com.springboot.store.payload.ProductPropertyDTO;
import com.springboot.store.service.ProductPropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-properties")
@RequiredArgsConstructor
public class ProductPropertyController {
    private final ProductPropertyService productPropertyService;

    @GetMapping("/{productPropertyId}")
    public ResponseEntity<ProductPropertyDTO> getProductPropertyById(@PathVariable int productPropertyId) {
        ProductPropertyDTO productPropertyDTO = productPropertyService.getProductPropertyById(productPropertyId);
        return ResponseEntity.ok(productPropertyDTO);
    }

    @GetMapping
    public ResponseEntity<List<ProductPropertyDTO>> getAllProductProperties() {
        List<ProductPropertyDTO> productProperties = productPropertyService.getAllProductProperties();
        return ResponseEntity.ok(productProperties);
    }

    @PostMapping
    public ResponseEntity<ProductPropertyDTO> createProductProperty(@RequestBody ProductPropertyDTO productPropertyDTO) {
        ProductPropertyDTO createdProductProperty = productPropertyService.createProductProperty(productPropertyDTO);
        return ResponseEntity.ok(createdProductProperty);
    }

    @PutMapping("/{productPropertyId}")
    public ResponseEntity<ProductPropertyDTO> updateProductProperty(
            @PathVariable int productPropertyId,
            @RequestBody ProductPropertyDTO productPropertyDTO
    ) {
        ProductPropertyDTO updatedProductProperty = productPropertyService.updateProductProperty(productPropertyId, productPropertyDTO);
        return ResponseEntity.ok(updatedProductProperty);
    }

    @DeleteMapping("/{productPropertyId}")
    public ResponseEntity<Void> deleteProductProperty(@PathVariable int productPropertyId) {
        productPropertyService.deleteProductProperty(productPropertyId);
        return ResponseEntity.noContent().build();
    }
}
