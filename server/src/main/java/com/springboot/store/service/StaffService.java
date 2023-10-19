package com.springboot.store.service;

import com.springboot.store.entity.Staff;
import com.springboot.store.payload.StaffRequest;
import com.springboot.store.payload.StaffResponse;

import java.util.List;

public interface StaffService {
    StaffResponse createStaff(StaffRequest newStaff, Staff creator);
    List<StaffResponse> getAllStaffs();
    StaffResponse getStaffById(int id);
    StaffResponse updateStaff(int id, StaffRequest staffRequest, Staff creator);
    void deleteStaff(int id, Staff creator);
    Staff findByEmail(String email);
}
