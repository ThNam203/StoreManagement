package com.springboot.store.service;

import com.springboot.store.payload.ShiftDTO;

import java.util.List;

public interface ShiftService {
    ShiftDTO getShift(int shiftId);

    List<ShiftDTO> getAllShifts();

    ShiftDTO updateShift(int shiftId, ShiftDTO shiftDTO);

    ShiftDTO createShift(ShiftDTO shiftDTO);

    void deleteShift(int shiftId);
}
