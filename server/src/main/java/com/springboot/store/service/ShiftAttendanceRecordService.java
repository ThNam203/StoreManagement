package com.springboot.store.service;

import com.springboot.store.payload.ShiftAttendanceRecordDTO;

public interface ShiftAttendanceRecordService {
    ShiftAttendanceRecordDTO getShiftAttendanceRecord(int id);

    ShiftAttendanceRecordDTO createShiftAttendanceRecord(ShiftAttendanceRecordDTO shiftAttendanceRecordDTO);

    ShiftAttendanceRecordDTO updateShiftAttendanceRecord(int id, ShiftAttendanceRecordDTO shiftAttendanceRecordDTO);

    void deleteShiftAttendanceRecord(int id);
}
