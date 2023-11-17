package com.springboot.store.service;

import com.springboot.store.payload.StaffSalaryDTO;

public interface StaffSalaryService {
    StaffSalaryDTO getStaffSalaryById(int id);

    StaffSalaryDTO createStaffSalary(StaffSalaryDTO staffSalaryDTO);

    StaffSalaryDTO updateStaffSalary(int id, StaffSalaryDTO staffSalaryDTO);

    void deleteStaffSalary(int id);
}
