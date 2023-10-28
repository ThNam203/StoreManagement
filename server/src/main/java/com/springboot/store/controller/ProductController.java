package com.springboot.store.controller;

import com.springboot.store.entity.Media;
import com.springboot.store.entity.Product;
import com.springboot.store.payload.ProductDTO;
import com.springboot.store.repository.ProductRepository;
import com.springboot.store.service.FileService;
import com.springboot.store.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final ProductService productService;
    private final FileService fileService ;



    @Autowired
    public ProductController(ProductService productService, FileService fileService, ProductRepository productRepository ) {
        this.productService = productService;
        this.fileService = fileService;
        this.productRepository = productRepository;
    }

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
    public ResponseEntity<ProductDTO> createProduct(@RequestPart(value = "file",required = false) MultipartFile file,
                                                    @RequestPart("data") ProductDTO productDTO) {
        ProductDTO createdProduct = productService.createProduct(file, productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable int productId, @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(productId, productDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable int productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/{productId}/uploadFile")
    public ResponseEntity<String> uploadFile(@RequestParam(value="file") MultipartFile file, @PathVariable int productId) {
        String url = fileService.uploadFile(file);
        Media media = Media.builder().url(url).build();
        Product product = productRepository.findById(productId).orElse(null);
        assert product != null;
        product.getImages().add(media);
        productRepository.save(product);
        return new ResponseEntity<>(url, HttpStatus.OK);
    }

}
