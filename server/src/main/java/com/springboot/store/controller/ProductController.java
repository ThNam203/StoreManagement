package com.springboot.store.controller;

import com.springboot.store.entity.Media;
import com.springboot.store.entity.Product;
import com.springboot.store.payload.ProductDTO;
import com.springboot.store.repository.ProductRepository;
import com.springboot.store.service.FileService;
import com.springboot.store.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;


    @GetMapping("/{productId}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable int productId) {
        ProductDTO productDTO = productService.getProductById(productId);
        return ResponseEntity.ok(productDTO);
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<List<ProductDTO>> createProduct(@RequestPart(value = "files", required = false) MultipartFile[] files,
                                                    @RequestPart("data") List<ProductDTO> productDTO) {
        List<ProductDTO> createdProduct = productService.createProduct(files, productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable int productId,
                                                    @RequestPart(value = "files", required = false) MultipartFile[] files,
                                                    @RequestPart("data") ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(productId, files, productDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable int productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllProducts() {
        productService.deleteAllProducts();
        return ResponseEntity.noContent().build();
    }
}
