package com.springboot.store.service;

import com.springboot.store.payload.ShiftDTO;

import java.util.Date;
import java.util.List;

public interface ShiftService {
    ShiftDTO getShift(int shiftId);

    List<ShiftDTO> getAllShifts();

    List<ShiftDTO> getAllShiftsInMonth();

    List<ShiftDTO> getAllShiftsInRange(Date startDate, Date endDate);

    ShiftDTO updateShift(int shiftId, ShiftDTO shiftDTO);

    ShiftDTO createShift(ShiftDTO shiftDTO);

    void deleteShift(int shiftId);
}
