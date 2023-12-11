package com.springboot.store.controller;

import com.springboot.store.payload.ReturnInvoiceDTO;
import com.springboot.store.service.ReturnInvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/return-invoices")
public class ReturnInvoiceController {
    private final ReturnInvoiceService returnInvoiceService;

    @GetMapping
    public ResponseEntity<List<ReturnInvoiceDTO>> getAllReturnInvoices() {
        return ResponseEntity.ok(returnInvoiceService.getAllReturnInvoices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReturnInvoiceDTO> getReturnInvoiceById(@PathVariable int id) {
        return ResponseEntity.ok(returnInvoiceService.getReturnInvoiceById(id));
    }

    @PostMapping
    public ResponseEntity<ReturnInvoiceDTO> createReturnInvoice(@RequestBody ReturnInvoiceDTO returnInvoiceDTO) {
        return ResponseEntity.status(201).body(returnInvoiceService.createReturnInvoice(returnInvoiceDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReturnInvoiceDTO> updateReturnInvoice(@PathVariable int id, @RequestBody ReturnInvoiceDTO returnInvoiceDTO) {
        return ResponseEntity.ok(returnInvoiceService.updateReturnInvoice(id, returnInvoiceDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReturnInvoice(@PathVariable int id) {
        returnInvoiceService.deleteReturnInvoice(id);
        return ResponseEntity.ok("Return invoice deleted successfully");
    }
}
