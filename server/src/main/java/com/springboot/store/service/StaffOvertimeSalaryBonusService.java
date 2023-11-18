package com.springboot.store.service;

import com.springboot.store.payload.StaffOvertimeSalaryBonusDTO;

public interface StaffOvertimeSalaryBonusService {
    StaffOvertimeSalaryBonusDTO getStaffOvertimeSalaryBonus(int id);

    StaffOvertimeSalaryBonusDTO createStaffOvertimeSalaryBonus(StaffOvertimeSalaryBonusDTO staffOvertimeSalaryBonusDTO);

    StaffOvertimeSalaryBonusDTO updateStaffOvertimeSalaryBonus(int id, StaffOvertimeSalaryBonusDTO staffOvertimeSalaryBonusDTO);

    void deleteStaffOvertimeSalaryBonus(int id);
}
