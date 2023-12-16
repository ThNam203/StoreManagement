package com.springboot.store.controller;

import com.springboot.store.payload.SupplierGroupDTO;
import com.springboot.store.service.SupplierGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/supplier-groups")
public class SupplierGroupController {
    private final SupplierGroupService supplierGroupService;

    @GetMapping
    public ResponseEntity<?> getAllSupplierGroups() {
        return new ResponseEntity<>(supplierGroupService.getAllSupplierGroups(), null, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSupplierGroupById(@PathVariable int id) {
        return new ResponseEntity<>(supplierGroupService.getSupplierGroupById(id), null, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createSupplierGroup(@RequestBody SupplierGroupDTO supplierGroupDTO) {
        return new ResponseEntity<>(supplierGroupService.createSupplierGroup(supplierGroupDTO), null, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupplierGroup(@PathVariable(name = "id") int id,
                                                 @RequestBody SupplierGroupDTO supplierGroupDTO) {
        return new ResponseEntity<>(supplierGroupService.updateSupplierGroup(id, supplierGroupDTO), null, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplierGroup(@PathVariable int id) {
        supplierGroupService.deleteSupplierGroup(id);
        return new ResponseEntity<>(null, null, HttpStatus.OK);
    }
}
