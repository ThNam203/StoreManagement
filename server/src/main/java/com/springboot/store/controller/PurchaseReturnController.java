package com.springboot.store.controller;

import com.springboot.store.payload.PurchaseReturnDTO;
import com.springboot.store.service.PurchaseReturnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/purchase-returns")
public class PurchaseReturnController {
    private final PurchaseReturnService purchaseReturnService;

    @GetMapping
    public ResponseEntity<List<PurchaseReturnDTO>> getAllPurchaseReturns() {
        return ResponseEntity.ok(purchaseReturnService.getAllPurchaseReturns());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseReturnDTO> getPurchaseReturnById(@PathVariable int id) {
        return ResponseEntity.ok(purchaseReturnService.getPurchaseReturnById(id));
    }

    @PostMapping
    public ResponseEntity<PurchaseReturnDTO> createPurchaseReturn(@RequestBody PurchaseReturnDTO purchaseReturnDTO) {
        return ResponseEntity.status(201).body(purchaseReturnService.createPurchaseReturn(purchaseReturnDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PurchaseReturnDTO> updatePurchaseReturn(@PathVariable int id, @RequestBody PurchaseReturnDTO purchaseReturnDTO) {
        return ResponseEntity.ok(purchaseReturnService.updatePurchaseReturn(id, purchaseReturnDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePurchaseReturn(@PathVariable int id) {
        purchaseReturnService.deletePurchaseReturn(id);
        return ResponseEntity.ok(Map.of("message", "Purchase return deleted successfully"));
    }
}
