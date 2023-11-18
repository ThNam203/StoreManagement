package com.springboot.store.controller;

import com.springboot.store.payload.StaffBaseSalaryBonusDTO;
import com.springboot.store.service.StaffBaseSalaryBonusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff-base-salary-bonus")
@RequiredArgsConstructor
public class StaffBaseSalaryBonusController {
    private final StaffBaseSalaryBonusService staffBaseSalaryBonusService;

    @GetMapping("/{staffBaseSalaryBonusId}")
    public ResponseEntity<StaffBaseSalaryBonusDTO> getStaffBaseSalaryBonusById(@PathVariable int staffBaseSalaryBonusId) {
        StaffBaseSalaryBonusDTO staffBaseSalaryBonusDTO = staffBaseSalaryBonusService.getStaffBaseSalaryBonus(staffBaseSalaryBonusId);
        return ResponseEntity.ok(staffBaseSalaryBonusDTO);
    }

    @PostMapping
    public ResponseEntity<StaffBaseSalaryBonusDTO> createStaffBaseSalaryBonus(@RequestBody StaffBaseSalaryBonusDTO staffBaseSalaryBonusDTO) {
        StaffBaseSalaryBonusDTO createdStaffBaseSalaryBonus = staffBaseSalaryBonusService.createStaffBaseSalaryBonus(staffBaseSalaryBonusDTO);
        return ResponseEntity.ok(createdStaffBaseSalaryBonus);
    }

    @PutMapping("/{staffBaseSalaryBonusId}")
    public ResponseEntity<StaffBaseSalaryBonusDTO> updateStaffBaseSalaryBonus(@PathVariable int staffBaseSalaryBonusId, @RequestBody StaffBaseSalaryBonusDTO staffBaseSalaryBonusDTO) {
        StaffBaseSalaryBonusDTO updatedStaffBaseSalaryBonus = staffBaseSalaryBonusService.updateStaffBaseSalaryBonus(staffBaseSalaryBonusId, staffBaseSalaryBonusDTO);
        return ResponseEntity.ok(updatedStaffBaseSalaryBonus);
    }

    @DeleteMapping("/{staffBaseSalaryBonusId}")
    public ResponseEntity<Void> deleteStaffBaseSalaryBonus(@PathVariable int staffBaseSalaryBonusId) {
        staffBaseSalaryBonusService.deleteStaffBaseSalaryBonus(staffBaseSalaryBonusId);
        return ResponseEntity.noContent().build();
    }
}
