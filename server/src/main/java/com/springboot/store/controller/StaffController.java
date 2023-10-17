package com.springboot.store.controller;

import com.springboot.store.payload.StaffDto;
import com.springboot.store.service.StaffService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staffs")
public class StaffController {
    private StaffService staffService;

    // Spring will automatically inject StaffService instance into this constructor
    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    // create a new staff
    @PostMapping
    public ResponseEntity<StaffDto> createStaff(@Valid @RequestBody StaffDto staffDto) {
        return new ResponseEntity<>(staffService.createStaff(staffDto), null, HttpStatus.CREATED);
    }

    // get all staffs
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllStaffs(HttpServletRequest request) {
        return new ResponseEntity<>(staffService.getAllStaffs(), null, HttpStatus.OK);
    }

    // get staff by id
    @GetMapping("/{id}")
    public ResponseEntity<StaffDto> getStaffById(@PathVariable int id) {
        return new ResponseEntity<>(staffService.getStaffById(id), null, HttpStatus.OK);
    }

    // update staff by id
    @PutMapping("/{id}")
    public ResponseEntity<StaffDto> updateStaff(@Valid @PathVariable(name = "id") int id, @RequestBody StaffDto staffDto) {
        return new ResponseEntity<>(staffService.updateStaff(id, staffDto), null, HttpStatus.OK);
    }

    // delete staff by id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable(name = "id") int id) {
        staffService.deleteStaff(id);
        return new ResponseEntity<>("Staff entity deleted successfully.", null, HttpStatus.OK);
    }
}
