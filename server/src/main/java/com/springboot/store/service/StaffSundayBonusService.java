package com.springboot.store.service;

import com.springboot.store.payload.StaffSundayBonusDTO;

public interface StaffSundayBonusService {
    StaffSundayBonusDTO getStaffSundayBonus(int id);

    StaffSundayBonusDTO createStaffSundayBonus(StaffSundayBonusDTO staffSundayBonusDTO);

    StaffSundayBonusDTO updateStaffSundayBonus(int id, StaffSundayBonusDTO staffSundayBonusDTO);

    void deleteStaffSundayBonus(int id);
}
