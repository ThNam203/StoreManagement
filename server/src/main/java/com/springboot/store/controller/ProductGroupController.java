package com.springboot.store.controller;

import com.springboot.store.payload.ProductDTO;
import com.springboot.store.payload.ProductGroupDTO;
import com.springboot.store.service.ProductGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-groups")
@RequiredArgsConstructor
public class ProductGroupController {
    private final ProductGroupService productGroupService;

    // get all product groups
    @GetMapping
    public ResponseEntity<List<ProductGroupDTO>> getAllProductGroups() {
        List<ProductGroupDTO> productGroups = productGroupService.getAllProductGroups();
        return ResponseEntity.ok(productGroups);
    }

    // get product group by id
    @GetMapping("/{productGroupId}")
    public ResponseEntity<ProductGroupDTO> getProductGroupById(@PathVariable int productGroupId) {
        ProductGroupDTO productGroupDTO = productGroupService.getProductGroupById(productGroupId);
        return ResponseEntity.ok(productGroupDTO);
    }

    // create product group
    @PostMapping
    public ResponseEntity<ProductGroupDTO> createProductGroup(@RequestBody ProductGroupDTO productGroupDTO) {
        ProductGroupDTO createdProductGroup = productGroupService.createProductGroup(productGroupDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProductGroup);
    }

    // update product group
    @PutMapping("/{productGroupId}")
    public ResponseEntity<ProductGroupDTO> updateProductGroup(@PathVariable int productGroupId,
                                                              @RequestBody ProductGroupDTO productGroupDTO) {
        ProductGroupDTO updatedProductGroup = productGroupService.updateProductGroup(productGroupId, productGroupDTO);
        return ResponseEntity.ok(updatedProductGroup);
    }

    // delete product group
    @DeleteMapping("/{productGroupId}")
    public ResponseEntity<Void> deleteProductGroup(@PathVariable int productGroupId) {
        productGroupService.deleteProductGroup(productGroupId);
        return ResponseEntity.noContent().build();
    }

    // get all products by product group id
    @GetMapping("/{productGroupId}/products")
    public ResponseEntity<List<ProductDTO>> getAllProductsByProductGroupId(@PathVariable int productGroupId) {
        List<ProductDTO> products = productGroupService.getAllProductsByProductGroupId(productGroupId);
        return ResponseEntity.ok(products);
    }
}
