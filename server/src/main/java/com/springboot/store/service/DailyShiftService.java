package com.springboot.store.service;

import com.springboot.store.payload.DailyShiftDTO;

import java.util.List;

public interface DailyShiftService {
    DailyShiftDTO getDailyShift(int dailyShiftId);

    List<DailyShiftDTO> getAllDailyShifts();

    DailyShiftDTO updateDailyShift(int dailyShiftId, DailyShiftDTO dailyShiftDTO);

    DailyShiftDTO createDailyShift(DailyShiftDTO dailyShiftDTO);

    List<DailyShiftDTO> createDailyShifts(List<DailyShiftDTO> dailyShiftDTOList);

    void deleteDailyShift(int dailyShiftId);
}
