package com.springboot.store.service;

import com.springboot.store.payload.DailyShiftDTO;

public interface DailyShiftService {
    DailyShiftDTO getDailyShift(int dailyShiftId);

    DailyShiftDTO updateDailyShift(int dailyShiftId, DailyShiftDTO dailyShiftDTO);

    DailyShiftDTO createDailyShift(DailyShiftDTO dailyShiftDTO);

    void deleteDailyShift(int dailyShiftId);
}
