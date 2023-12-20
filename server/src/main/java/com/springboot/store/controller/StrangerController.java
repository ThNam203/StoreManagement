package com.springboot.store.controller;

import com.springboot.store.payload.StrangerDTO;
import com.springboot.store.service.StrangerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/strangers")
@RequiredArgsConstructor
public class StrangerController {
    private final StrangerService strangerService;

    @GetMapping
    public ResponseEntity<List<StrangerDTO>> getAllStrangers() {
        return ResponseEntity.ok(strangerService.getAllStrangers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StrangerDTO> getStrangerById(@PathVariable int id) {
        return ResponseEntity.ok(strangerService.getStrangerById(id));
    }

    @PostMapping
    public ResponseEntity<StrangerDTO> createStranger(@RequestBody StrangerDTO strangerDTO) {
        return ResponseEntity.status(201).body(strangerService.createStranger(strangerDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StrangerDTO> updateStranger(@PathVariable int id, @RequestBody StrangerDTO strangerDTO) {
        return ResponseEntity.ok(strangerService.updateStranger(id, strangerDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStranger(@PathVariable int id) {
        strangerService.deleteStranger(id);
        return ResponseEntity.noContent().build();
    }
}
