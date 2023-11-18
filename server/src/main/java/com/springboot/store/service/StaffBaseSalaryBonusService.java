package com.springboot.store.service;

import com.springboot.store.payload.StaffBaseSalaryBonusDTO;

public interface StaffBaseSalaryBonusService {
    StaffBaseSalaryBonusDTO getStaffBaseSalaryBonus(int id);

    StaffBaseSalaryBonusDTO createStaffBaseSalaryBonus(StaffBaseSalaryBonusDTO staffBaseSalaryBonusDTO);

    StaffBaseSalaryBonusDTO updateStaffBaseSalaryBonus(int id, StaffBaseSalaryBonusDTO staffBaseSalaryBonusDTO);

    void deleteStaffBaseSalaryBonus(int id);
}
