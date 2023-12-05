package com.springboot.store.controller;

import com.springboot.store.payload.ShiftDTO;
import com.springboot.store.service.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

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
    public ResponseEntity<List<ShiftDTO>> getAllShifts() {
        List<ShiftDTO> shifts = shiftService.getAllShifts();
        return ResponseEntity.ok(shifts);
    }
    @GetMapping("/month")
    public ResponseEntity<List<ShiftDTO>> getAllShiftsInMonth() {
        List<ShiftDTO> shifts = shiftService.getAllShiftsInMonth();
        return ResponseEntity.ok(shifts);
    }

    @GetMapping("/{startDate}/{endDate}")
    public ResponseEntity<List<ShiftDTO>> getAllShiftsInRange(@PathVariable String startDate, @PathVariable String endDate) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        Date start= formatter.parse(startDate, new java.text.ParsePosition(0));
        Date end= formatter.parse(endDate, new java.text.ParsePosition(0));
        List<ShiftDTO> shifts = shiftService.getAllShiftsInRange(start, end);
        return ResponseEntity.ok(shifts);
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
