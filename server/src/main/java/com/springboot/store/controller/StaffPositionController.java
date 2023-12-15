package com.springboot.store.controller;

import com.springboot.store.payload.StaffPositionDTO;
import com.springboot.store.service.StaffPositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff-positions")
@RequiredArgsConstructor
public class StaffPositionController {
    private final StaffPositionService staffPositionService;

    @PostMapping
    public ResponseEntity<StaffPositionDTO> createStaffPositions(@RequestBody StaffPositionDTO staffPositionDTO) {
        return ResponseEntity.ok(staffPositionService.createStaffPosition(staffPositionDTO));
    }

    @PutMapping("/{staffPositionId}")
    public ResponseEntity<StaffPositionDTO> updateStaffPosition(@PathVariable int staffPositionId, @RequestBody StaffPositionDTO staffPositionDTO) {
        return ResponseEntity.ok(staffPositionService.updateStaffPosition(staffPositionId, staffPositionDTO));
    }

    @DeleteMapping("/{staffPositionId}")
    public ResponseEntity<Void> deleteStaffPosition(@PathVariable int staffPositionId) {
        staffPositionService.deleteStaffPosition(staffPositionId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<StaffPositionDTO>> getAllStaffPositions() {
        return ResponseEntity.ok(staffPositionService.getAllStaffPositions());
    }
}
