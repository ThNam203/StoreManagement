package com.springboot.store.service;

import com.springboot.store.payload.ShiftWorkingTimeDTO;

public interface ShiftWorkingTimeService {
    ShiftWorkingTimeDTO getShiftWorkingTime(int shiftId);

    ShiftWorkingTimeDTO updateShiftWorkingTime(int shiftId, ShiftWorkingTimeDTO shiftWorkingTimeDTO);

    ShiftWorkingTimeDTO createShiftWorkingTime(ShiftWorkingTimeDTO shiftWorkingTimeDTO);

    void deleteShiftWorkingTime(int shiftId);
}
