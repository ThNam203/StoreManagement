package com.springboot.store.service;

import com.springboot.store.entity.StaffDayOffBonus;
import com.springboot.store.payload.StaffDayOffBonusDTO;

public interface StaffDayOffBonusService {
    StaffDayOffBonus getStaffDayOffBonus(int id);

    StaffDayOffBonusDTO createStaffDayOffBonus(StaffDayOffBonusDTO staffDayOffBonusDTO);

    StaffDayOffBonusDTO updateStaffDayOffBonus(int id, StaffDayOffBonusDTO staffDayOffBonusDTO);

    void deleteStaffDayOffBonus(int id);
}
