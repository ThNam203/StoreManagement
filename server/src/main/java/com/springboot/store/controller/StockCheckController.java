package com.springboot.store.controller;

import com.springboot.store.payload.StockCheckDTO;
import com.springboot.store.service.StockCheckService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock-checks")
@RequiredArgsConstructor
public class StockCheckController {
    private final StockCheckService stockCheckService;

    // get all stock checks
    @GetMapping
    public ResponseEntity<List<StockCheckDTO>> getAllStockChecks() {
        return ResponseEntity.ok(stockCheckService.getAllStockChecks());
    }

    // get stock check by id
    @GetMapping("/{id}")
    public ResponseEntity<StockCheckDTO> getStockCheckById(@PathVariable int id) {
        return ResponseEntity.ok(stockCheckService.getStockCheckById(id));
    }

    // create stock check
    @PostMapping()
    public ResponseEntity<StockCheckDTO> createStockCheck(@RequestBody StockCheckDTO stockCheckDTO) {
        return ResponseEntity.status(201).body(stockCheckService.createStockCheck(stockCheckDTO));
    }

    // update stock check
    @PutMapping("/{id}")
    public ResponseEntity<StockCheckDTO> updateStockCheck(@PathVariable int id, @RequestBody StockCheckDTO stockCheckDTO) {
        return ResponseEntity.ok(stockCheckService.updateStockCheck(id, stockCheckDTO));
    }

    // delete stock check
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStockCheck(@PathVariable int id) {
        stockCheckService.deleteStockCheck(id);
        Map<String, String> response = Map.of("message", "Stock check deleted successfully");
        return ResponseEntity.ok(response);
    }
}
