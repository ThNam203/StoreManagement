package com.springboot.store.controller;

import com.springboot.store.payload.SupplierDTO;
import com.springboot.store.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/suppliers")
public class SupplierController {
    private final SupplierService supplierService;

    @GetMapping
    public ResponseEntity<?> getAllSuppliers() {
        return new ResponseEntity<>(supplierService.getAllSuppliers(), null, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getSupplierById(@PathVariable int id) {
        return new ResponseEntity<>(supplierService.getSupplierById(id), null, HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<?> createSupplier(@Valid @RequestPart("data") SupplierDTO supplierDTO,
                                            @RequestPart(value = "file", required = false) MultipartFile file) {
        return new ResponseEntity<>(supplierService.createSupplier(supplierDTO, file), null, HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupplier(@Valid @PathVariable(name = "id") int id,
                                            @RequestPart("data") SupplierDTO supplierDTO,
                                            @RequestPart(value = "file", required = false) MultipartFile file) {
        return new ResponseEntity<>(supplierService.updateSupplier(id, supplierDTO, file), null, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable int id) {
        supplierService.deleteSupplier(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Delete supplier successfully");
        return new ResponseEntity<>(response, null, HttpStatus.OK);
    }
}
