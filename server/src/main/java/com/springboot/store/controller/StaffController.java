package com.springboot.store.controller;

import com.springboot.store.entity.Staff;
import com.springboot.store.payload.StaffRequest;
import com.springboot.store.payload.StaffResponse;
import com.springboot.store.service.ActivityLogService;
import com.springboot.store.service.AuthService;
import com.springboot.store.service.StaffService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staffs")
@RequiredArgsConstructor
public class StaffController {
    private final StaffService staffService;
    private final AuthService authService;
    private final ActivityLogService activityLogService;

//    Spring will automatically inject StaffService instance into this constructor
//    lombok will generate a constructor with all arguments for us
//    public StaffController(StaffService staffService) {
//        this.staffService = staffService;
//    }

    // create a new staff
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffResponse> createStaff(@Valid @RequestBody StaffRequest newStaff,
                                                     HttpServletRequest request) {
        final Staff currentStaff = authService.getCurrentStaff(request);
        StaffResponse staffResponse = staffService.createStaff(newStaff, currentStaff);
        activityLogService.save("CREATE", "Create new staff", currentStaff);
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
        return new ResponseEntity<>(staffService.getStaffById(id), null, HttpStatus.OK);
    }

    // update staff by id
    @PutMapping("/{id}")
    public ResponseEntity<StaffResponse> updateStaff(@Valid @PathVariable(name = "id") int id,
                                                     @RequestBody StaffRequest staffRequest,
                                                     HttpServletRequest request) {
        final Staff currentStaff = authService.getCurrentStaff(request);
        StaffResponse staffResponse = staffService.updateStaff(id, staffRequest, currentStaff);
        activityLogService.save("UPDATE", "Update staff with id " + id, currentStaff);
        return new ResponseEntity<>(staffResponse, null, HttpStatus.OK);
    }

    // delete staff by id
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteStaff(@PathVariable(name = "id") int id,
                                         HttpServletRequest request) {
        final Staff currentStaff = authService.getCurrentStaff(request);
        if (currentStaff.getId() == id) {
            return new ResponseEntity<>("You cannot delete yourself.", null, HttpStatus.BAD_REQUEST);
        }
        staffService.deleteStaff(id, currentStaff);
        activityLogService.save("DELETE", "Delete staff with id " + id, currentStaff);
        return new ResponseEntity<>("Staff entity deleted successfully.", null, HttpStatus.OK);
    }

}
