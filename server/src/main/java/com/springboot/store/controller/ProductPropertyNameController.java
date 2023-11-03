package com.springboot.store.controller;

import com.springboot.store.payload.ProductPropertyNameDTO;
import com.springboot.store.service.ProductPropertyNameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-property-names")
@RequiredArgsConstructor
public class ProductPropertyNameController {
    private final ProductPropertyNameService productPropertyNameService;

    @GetMapping("/{productPropertyNameId}")
    public ResponseEntity<ProductPropertyNameDTO> getProductPropertyNameById(@PathVariable int productPropertyNameId) {
        ProductPropertyNameDTO productPropertyNameDTO = productPropertyNameService.getProductPropertyNameById(productPropertyNameId);
        return ResponseEntity.ok(productPropertyNameDTO);
    }

    @GetMapping
    public ResponseEntity<List<ProductPropertyNameDTO>> getAllProductPropertyNames() {
        List<ProductPropertyNameDTO> productPropertyNameDTO = productPropertyNameService.getAllProductPropertyNames();
        return ResponseEntity.ok(productPropertyNameDTO);
    }

    @PostMapping
    public ResponseEntity<ProductPropertyNameDTO> createProductPropertyName(@RequestBody ProductPropertyNameDTO productPropertyNameDTO) {
        ProductPropertyNameDTO createdProductPropertyName = productPropertyNameService.createProductPropertyName(productPropertyNameDTO);
        return ResponseEntity.ok(createdProductPropertyName);
    }

    @PutMapping("/{productPropertyNameId}")
    public ResponseEntity<ProductPropertyNameDTO> updateProductPropertyName(
            @PathVariable int productPropertyNameId,
            @RequestBody ProductPropertyNameDTO productPropertyNameDTO
    ) {
        ProductPropertyNameDTO updatedProductPropertyName = productPropertyNameService.updateProductPropertyName(productPropertyNameId, productPropertyNameDTO);
        return ResponseEntity.ok(updatedProductPropertyName);
    }

    @DeleteMapping("/{productPropertyNameId}")
    public ResponseEntity<Void> deleteProductPropertyName(@PathVariable int productPropertyNameId) {
        productPropertyNameService.deleteProductPropertyName(productPropertyNameId);
        return ResponseEntity.noContent().build();
    }

}
