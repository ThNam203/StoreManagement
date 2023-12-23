package com.springboot.store.controller;

import com.springboot.store.payload.DamagedItemDTO;
import com.springboot.store.service.DamagedItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/damaged-items")
public class DamagedItemController {
    private final DamagedItemService damagedItemService;

    @GetMapping
    public ResponseEntity<?> getAllDamagedItems() {
        return ResponseEntity.ok(damagedItemService.getAllDamagedItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDamagedItemById(@PathVariable int id) {
        return ResponseEntity.ok(damagedItemService.getDamagedItemById(id));
    }

    @PostMapping
    public ResponseEntity<?> createDamagedItem(@RequestBody DamagedItemDTO damagedItemDTO) {
        return ResponseEntity.status(201).body(damagedItemService.createDamagedItem(damagedItemDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDamagedItem(@PathVariable int id, @RequestBody DamagedItemDTO damagedItemDTO) {
        return ResponseEntity.ok(damagedItemService.updateDamagedItem(id, damagedItemDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDamagedItem(@PathVariable int id) {
        damagedItemService.deleteDamagedItem(id);
        return ResponseEntity.ok().build();
    }
}
