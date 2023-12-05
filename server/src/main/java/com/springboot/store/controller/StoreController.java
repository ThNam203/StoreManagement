package com.springboot.store.controller;

import com.springboot.store.payload.StoreDTO;
import com.springboot.store.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/store")
@RequiredArgsConstructor
public class StoreController {
    private final StoreService storeService;

    @GetMapping
    public ResponseEntity<StoreDTO> getStore() {
        return ResponseEntity.ok(storeService.getStore());
    }

    @PutMapping
    public ResponseEntity<StoreDTO> updateStore(@RequestBody StoreDTO storeDTO) {
        return ResponseEntity.ok(storeService.updateStore(storeDTO));
    }
}
