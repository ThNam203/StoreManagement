package com.springboot.store.service;

import com.springboot.store.payload.StaffBaseSalaryDTO;

public interface StaffBaseSalaryService {
    StaffBaseSalaryDTO getStaffBaseSalary(int id);

    StaffBaseSalaryDTO createStaffBaseSalary(StaffBaseSalaryDTO staffBaseSalaryDTO);

    StaffBaseSalaryDTO updateStaffBaseSalary(int Id, StaffBaseSalaryDTO staffBaseSalaryDTO);

    void deleteStaffBaseSalary(int id);

}
