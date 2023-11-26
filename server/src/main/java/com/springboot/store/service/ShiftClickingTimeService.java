package com.springboot.store.service;

import com.springboot.store.payload.ShiftClickingTimeDTO;

public interface ShiftClickingTimeService {
    ShiftClickingTimeDTO getShiftClickingTime(int shiftId);

    ShiftClickingTimeDTO updateShiftClickingTime(int shiftId, ShiftClickingTimeDTO shiftClickingTimeDTO);

    ShiftClickingTimeDTO createShiftClickingTime(ShiftClickingTimeDTO shiftClickingTimeDTO);

    void deleteShiftClickingTime(int shiftId);
}
