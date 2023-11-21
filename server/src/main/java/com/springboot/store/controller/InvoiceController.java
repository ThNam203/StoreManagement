package com.springboot.store.controller;

import com.springboot.store.payload.InvoiceDTO;
import com.springboot.store.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoice")
@RequiredArgsConstructor
public class InvoiceController {
    private final InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<InvoiceDTO>> getAllInvoices() {
        List<InvoiceDTO> invoices = invoiceService.getAllInvoices();
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/{invoiceId}")
    public ResponseEntity<InvoiceDTO> getInvoiceById(@PathVariable int invoiceId) {
        InvoiceDTO invoiceDTO = invoiceService.getInvoiceById(invoiceId);
        return ResponseEntity.ok(invoiceDTO);
    }

    @PostMapping
    public ResponseEntity<InvoiceDTO> createInvoice(@RequestBody InvoiceDTO invoiceDTO) {
        InvoiceDTO createdInvoice = invoiceService.createInvoice(invoiceDTO);
        return ResponseEntity.ok(createdInvoice);
    }

    @PutMapping("/{invoiceId}")
    public ResponseEntity<InvoiceDTO> updateInvoice(
            @PathVariable int invoiceId,
            @RequestBody InvoiceDTO invoiceDTO
    ) {
        InvoiceDTO updatedInvoice = invoiceService.updateInvoice(invoiceId, invoiceDTO);
        return ResponseEntity.ok(updatedInvoice);
    }

    @DeleteMapping("/{invoiceId}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable int invoiceId) {
        invoiceService.deleteInvoice(invoiceId);
        return ResponseEntity.noContent().build();
    }
}
