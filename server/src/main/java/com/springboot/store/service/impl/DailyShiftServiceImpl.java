package com.springboot.store.service.impl;

import com.springboot.store.entity.DailyShift;
import com.springboot.store.entity.ShiftAttendanceRecord;
import com.springboot.store.payload.DailyShiftDTO;
import com.springboot.store.payload.ShiftAttendanceRecordDTO;
import com.springboot.store.repository.DailyShiftRepository;
import com.springboot.store.repository.ShiftAttendanceRecordRepository;
import com.springboot.store.service.DailyShiftService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyShiftServiceImpl implements DailyShiftService {
    private final DailyShiftRepository dailyShiftRepository;
    private final ModelMapper modelMapper;

    @Override
    public DailyShiftDTO getDailyShift(int dailyShiftId) {
        DailyShift dailyShift = dailyShiftRepository.findById(dailyShiftId).orElseThrow(() -> new EntityNotFoundException("DailyShift not found with id: " + dailyShiftId));
        return modelMapper.map(dailyShift, DailyShiftDTO.class);
    }

    @Override
    public DailyShiftDTO updateDailyShift(int dailyShiftId, DailyShiftDTO dailyShiftDTO) {
        DailyShift existingDailyShift = dailyShiftRepository.findById(dailyShiftId).orElseThrow(() -> new EntityNotFoundException("DailyShift not found with id: " + dailyShiftId));
        existingDailyShift.setDate(dailyShiftDTO.getDate());
        existingDailyShift.setNote(dailyShiftDTO.getNote());
        List<ShiftAttendanceRecord> attendanceRecordList = new ArrayList<>();
        for (ShiftAttendanceRecordDTO shiftAttendanceRecordDTO : dailyShiftDTO.getAttendanceList()) {
            ShiftAttendanceRecord shiftAttendanceRecord = modelMapper.map(shiftAttendanceRecordDTO, ShiftAttendanceRecord.class);
            attendanceRecordList.add(shiftAttendanceRecord);
        }
        existingDailyShift.setAttendanceList(attendanceRecordList);
        existingDailyShift = dailyShiftRepository.save(existingDailyShift);
        return modelMapper.map(existingDailyShift, DailyShiftDTO.class);
    }

    @Override
    public DailyShiftDTO createDailyShift(DailyShiftDTO dailyShiftDTO) {
        DailyShift dailyShift = DailyShift.builder()
                .date(dailyShiftDTO.getDate())
                .note(dailyShiftDTO.getNote())
                .build();
        List<ShiftAttendanceRecord> attendanceRecordList = new ArrayList<>();
        for (ShiftAttendanceRecordDTO shiftAttendanceRecordDTO : dailyShiftDTO.getAttendanceList()) {
            ShiftAttendanceRecord shiftAttendanceRecord = modelMapper.map(shiftAttendanceRecordDTO, ShiftAttendanceRecord.class);
            attendanceRecordList.add(shiftAttendanceRecord);
        }
        dailyShift.setAttendanceList(attendanceRecordList);
        dailyShift = dailyShiftRepository.save(dailyShift);
        return modelMapper.map(dailyShift, DailyShiftDTO.class);
    }

    @Override
    public void deleteDailyShift(int dailyShiftId) {
        dailyShiftRepository.deleteById(dailyShiftId);
    }
}
