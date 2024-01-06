package com.springboot.store.controller;

import com.springboot.store.entity.Staff;
import com.springboot.store.payload.StaffRequest;
import com.springboot.store.payload.StaffResponse;
import com.springboot.store.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/staffs")
@RequiredArgsConstructor
public class StaffController {
    private final StaffService staffService;

//    Spring will automatically inject StaffService instance into this constructor
//    lombok will generate a constructor with all arguments for us
//    public StaffController(StaffService staffService) {
//        this.staffService = staffService;
//    }

    // create a new staff
    @PostMapping
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffResponse> createStaff(@Valid @RequestPart("data") StaffRequest newStaff, @RequestPart(value = "file", required = false) MultipartFile file) {
        StaffResponse staffResponse = staffService.createStaff(newStaff, file);
        return new ResponseEntity<>(staffResponse, null, HttpStatus.CREATED);
    }


    // get all staffs
    @GetMapping
    public ResponseEntity<?> getAllStaffs() {
        return new ResponseEntity<>(staffService.getAllStaffs(), null, HttpStatus.OK);
    }

    // get staff by id
    @GetMapping("/{id}")
    public ResponseEntity<StaffResponse> getStaffById(@PathVariable int id) {
        if (id == 0) {
            Staff staff = staffService.getAuthorizedStaff();
            return new ResponseEntity<>(staffService.getStaffById(staff.getId()), null, HttpStatus.OK);
        }
        return new ResponseEntity<>(staffService.getStaffById(id), null, HttpStatus.OK);
    }

    // update staff by id
    @PutMapping("/{id}")
    public ResponseEntity<StaffResponse> updateStaff(@Valid @PathVariable(name = "id") int id,
                                                     @RequestPart("data") StaffRequest staffRequest,
                                                     @RequestPart(value = "file", required = false) MultipartFile file) {
        StaffResponse staffResponse = staffService.updateStaff(id, staffRequest, file);
        return new ResponseEntity<>(staffResponse, null, HttpStatus.OK);
    }

    // delete staff by id
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteStaff(@PathVariable(name = "id") int id) {
        staffService.deleteStaff(id);
        return new ResponseEntity<>("Staff entity deleted successfully.", null, HttpStatus.OK);
    }

    // get staff salary by id
    @GetMapping("/{id}/calculate-salary")
    public ResponseEntity<?> getStaffSalary(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok().body(staffService.getStaffSalary(id));
    }
}
