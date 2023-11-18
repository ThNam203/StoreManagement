package com.springboot.store.service;

import com.springboot.store.payload.StaffHolidayBonusDTO;

public interface StaffHolidayBonusService {
    StaffHolidayBonusDTO getStaffHolidayBonus(int id);

    StaffHolidayBonusDTO createStaffHolidayBonus(StaffHolidayBonusDTO staffHolidayBonusDTO);

    StaffHolidayBonusDTO updateStaffHolidayBonus(int id, StaffHolidayBonusDTO staffHolidayBonusDTO);

    void deleteStaffHolidayBonus(int id);
}
