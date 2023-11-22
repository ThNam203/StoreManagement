package com.springboot.store.controller;

import com.springboot.store.exception.CustomException;
import com.springboot.store.payload.DiscountDTO;
import com.springboot.store.service.DiscountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/discounts")
@RequiredArgsConstructor
public class DiscountController {
    private final DiscountService discountService;

    @GetMapping
    public ResponseEntity<List<DiscountDTO>> getAllDiscounts() {
        return ResponseEntity.ok(discountService.getAllDiscounts());
    }
    @GetMapping("/{id}")
    public ResponseEntity<DiscountDTO> getDiscountById(@PathVariable int id) {
        return ResponseEntity.ok(discountService.getDiscountById(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<DiscountDTO> updateDiscount(@PathVariable int id, @RequestBody DiscountDTO discountDTO) {
        return ResponseEntity.ok(discountService.updateDiscount(id, discountDTO));
    }
    @PostMapping
    public ResponseEntity<DiscountDTO> createDiscount(@RequestBody DiscountDTO discountDTO) {
        return ResponseEntity.status(201).body(discountService.createDiscount(discountDTO));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDiscount(@PathVariable int id) {
        discountService.deleteDiscount(id);
        Map<String, String> body = new HashMap<>();
        body.put("message", "Discount deleted successfully");
        return ResponseEntity.ok(body);
    }
    @PostMapping("/{id}/generate")
    public ResponseEntity<?> generateDiscountCodes(@PathVariable int id, @RequestParam int amount) {
        try {
            List<String> codes = new ArrayList<>();
            for (int i = 0; i < amount; i++) {
                codes.add(discountService.generateDiscountCode(id));
            }
            Map<String, List<String>> responseBody = new HashMap<>();
            responseBody.put("codes", codes);
            return ResponseEntity.status(201).body(responseBody);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // get discount by code
    @GetMapping("/code")
    public ResponseEntity<DiscountDTO> getDiscountByCode(@RequestParam String value) {
        return ResponseEntity.ok(discountService.getDiscountByCode(value));
    }

}
