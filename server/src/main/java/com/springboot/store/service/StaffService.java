package com.springboot.store.service;

import com.springboot.store.entity.Staff;
import com.springboot.store.payload.StaffDto;
import com.springboot.store.utils.Role;

import java.util.List;

public interface StaffService {
    StaffDto createStaff(Staff staff, Staff creator);
    List<StaffDto> getAllStaffs();
    StaffDto getStaffById(int id);
    StaffDto updateStaff(int id, StaffDto staffDto);
    void deleteStaff(int id, Staff creator);
}
