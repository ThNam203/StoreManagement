package com.springboot.store.controller;

import com.springboot.store.payload.StaffSalaryDTO;
import com.springboot.store.service.StaffSalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff-salary")
@RequiredArgsConstructor
public class StaffSalaryController {
    private final StaffSalaryService staffSalaryService;

    @GetMapping("/{staffSalaryId}")
    public ResponseEntity<StaffSalaryDTO> getStaffSalaryById(@PathVariable int staffSalaryId) {
        StaffSalaryDTO staffSalaryDTO = staffSalaryService.getStaffSalaryById(staffSalaryId);
        return ResponseEntity.ok(staffSalaryDTO);
    }

    @PostMapping
    public ResponseEntity<StaffSalaryDTO> createStaffSalary(@RequestBody StaffSalaryDTO staffSalaryDTO) {
        StaffSalaryDTO createdStaffSalary = staffSalaryService.createStaffSalary(staffSalaryDTO);
        return ResponseEntity.ok(createdStaffSalary);
    }

    @PutMapping("/{staffSalaryId}")
    public ResponseEntity<StaffSalaryDTO> updateStaffSalary(@PathVariable int staffSalaryId, @RequestBody StaffSalaryDTO staffSalaryDTO) {
        StaffSalaryDTO updatedStaffSalary = staffSalaryService.updateStaffSalary(staffSalaryId, staffSalaryDTO);
        return ResponseEntity.ok(updatedStaffSalary);
    }

    @DeleteMapping("/{staffSalaryId}")
    public ResponseEntity<Void> deleteStaffSalary(@PathVariable int staffSalaryId) {
        staffSalaryService.deleteStaffSalary(staffSalaryId);
        return ResponseEntity.noContent().build();
    }
}
