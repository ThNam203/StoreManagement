package com.springboot.store.service;

import com.springboot.store.payload.StaffSaturdayBonusDTO;

public interface StaffSaturdayBonusService {
    StaffSaturdayBonusDTO getStaffSaturdayBonus(int id);

    StaffSaturdayBonusDTO createStaffSaturdayBonus(StaffSaturdayBonusDTO staffSaturdayBonusDTO);

    StaffSaturdayBonusDTO updateStaffSaturdayBonus(int id, StaffSaturdayBonusDTO staffSaturdayBonusDTO);

    void deleteStaffSaturdayBonus(int id);

}
