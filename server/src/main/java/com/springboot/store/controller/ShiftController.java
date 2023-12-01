package com.springboot.store.controller;

import com.springboot.store.payload.ShiftDTO;
import com.springboot.store.service.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shifts")
@RequiredArgsConstructor
public class ShiftController {
    private final ShiftService shiftService;

    @GetMapping("/{shiftId}")
    public ResponseEntity<ShiftDTO> getShiftById(@PathVariable int shiftId) {
        ShiftDTO shiftDTO = shiftService.getShift(shiftId);
        return ResponseEntity.ok(shiftDTO);
    }

    @GetMapping
    public ResponseEntity<?> getAllShifts() {
        return ResponseEntity.ok(shiftService.getAllShifts());
    }

    @PostMapping
    public ResponseEntity<ShiftDTO> createShift(@RequestBody ShiftDTO shiftDTO) {
        ShiftDTO createdShift = shiftService.createShift(shiftDTO);
        return ResponseEntity.ok(createdShift);
    }

    @PutMapping("/{shiftId}")
    public ResponseEntity<ShiftDTO> updateShift(@PathVariable int shiftId, @RequestBody ShiftDTO shiftDTO) {
        ShiftDTO updatedShift = shiftService.updateShift(shiftId, shiftDTO);
        return ResponseEntity.ok(updatedShift);
    }

    @DeleteMapping("/{shiftId}")
    public ResponseEntity<Void> deleteShift(@PathVariable int shiftId) {
        shiftService.deleteShift(shiftId);
        return ResponseEntity.noContent().build();
    }

}
