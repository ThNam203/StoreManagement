package com.springboot.store.service.impl;

import com.springboot.store.entity.*;
import com.springboot.store.payload.DailyShiftDTO;
import com.springboot.store.payload.ShiftAttendanceRecordDTO;
import com.springboot.store.payload.ShiftDTO;
import com.springboot.store.repository.ShiftRepository;
import com.springboot.store.repository.StaffRepository;
import com.springboot.store.service.DailyShiftService;
import com.springboot.store.service.ShiftService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ShiftServiceImpl implements ShiftService {
    private final ShiftRepository shiftRepository;
    private final ModelMapper modelMapper;
    private final DailyShiftService dailyShiftService;
    private final StaffRepository staffRepository;

    @Override
    public ShiftDTO getShift(int shiftId) {
        Shift shift = shiftRepository.findById(shiftId).orElseThrow(() -> new EntityNotFoundException("Shift not found with id: " + shiftId));
        return modelMapper.map(shift, ShiftDTO.class);
    }

    @Override
    public List<ShiftDTO> getAllShifts() {
        List<Shift> shifts = shiftRepository.findAll();
        return shifts.stream()
                .map((shift) -> {
                    ShiftDTO shiftDTO = modelMapper.map(shift, ShiftDTO.class);
                    for (DailyShiftDTO dailyShiftDTO : shiftDTO.getDailyShiftList()) {
                        dailyShiftDTO.setShiftId(shiftDTO.getId());
                        dailyShiftDTO.setShiftName(shiftDTO.getName());
                        for (ShiftAttendanceRecordDTO shiftAttendanceRecordDTO : dailyShiftDTO.getAttendanceList()) {
                            shiftAttendanceRecordDTO.setStaffName(staffRepository.findById(shiftAttendanceRecordDTO.getStaffId()).orElseThrow().getName());
                        }
                    }
                    return shiftDTO;
                })
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public ShiftDTO updateShift(int shiftId, ShiftDTO shiftDTO) {
        Shift existingShift = shiftRepository.findById(shiftId).orElseThrow(() -> new EntityNotFoundException("Shift not found with id: " + shiftId));
        existingShift.setName(shiftDTO.getName());
        existingShift.setStatus(shiftDTO.getStatus());
        ShiftWorkingTime workingTime = ShiftWorkingTime.builder()
                .startTime(shiftDTO.getWorkingTime().getStartTime())
                .endTime(shiftDTO.getWorkingTime().getEndTime())
                .build();
        existingShift.setWorkingTime(workingTime);
        ShiftClickingTime clickingTime = ShiftClickingTime.builder()
                .startTime(shiftDTO.getClickingTime().getStartTime())
                .endTime(shiftDTO.getClickingTime().getEndTime())
                .build();
        existingShift.setClickingTime(clickingTime);
        List<DailyShift> dailyShiftList = new ArrayList<>();
        for (DailyShiftDTO dailyShiftDTO : shiftDTO.getDailyShiftList()) {
            DailyShift dailyShift = DailyShift.builder()
                    .date(dailyShiftDTO.getDate())
                    .note(dailyShiftDTO.getNote())
                    .build();
            List<ShiftAttendanceRecord> attendanceRecordList = new ArrayList<>();
            for (ShiftAttendanceRecordDTO shiftAttendanceRecordDTO : dailyShiftDTO.getAttendanceList()) {
                ShiftAttendanceRecord shiftAttendanceRecord = ShiftAttendanceRecord.builder()
                        .hasAttend(shiftAttendanceRecordDTO.isHasAttend())
                        .date(shiftAttendanceRecordDTO.getDate())
                        .timeIn(shiftAttendanceRecordDTO.getTimeIn())
                        .timeOut(shiftAttendanceRecordDTO.getTimeOut())
                        .note(shiftAttendanceRecordDTO.getNote())
                        .build();
                attendanceRecordList.add(shiftAttendanceRecord);
            }
            dailyShift.setAttendanceList(attendanceRecordList);
            dailyShiftList.add(dailyShift);
        }
        existingShift.setDailyShifts(dailyShiftList);
        existingShift = shiftRepository.save(existingShift);
        shiftDTO = modelMapper.map(existingShift, ShiftDTO.class);
        for (DailyShiftDTO dailyShiftDTO : shiftDTO.getDailyShiftList()) {
            dailyShiftDTO.setShiftId(shiftDTO.getId());
            dailyShiftDTO.setShiftName(shiftDTO.getName());
            for (ShiftAttendanceRecordDTO shiftAttendanceRecordDTO : dailyShiftDTO.getAttendanceList()) {
                shiftAttendanceRecordDTO.setStaffName(staffRepository.findById(shiftAttendanceRecordDTO.getStaffId()).orElseThrow().getName());
            }
        }
        return shiftDTO;
    }

    @Override
    public ShiftDTO createShift(ShiftDTO shiftDTO) {
        Shift shift = Shift.builder()
                .name(shiftDTO.getName())
                .status(shiftDTO.getStatus())
                .build();
        ShiftWorkingTime workingTime = ShiftWorkingTime.builder()
                .startTime(shiftDTO.getWorkingTime().getStartTime())
                .endTime(shiftDTO.getWorkingTime().getEndTime())
                .build();
        shift.setWorkingTime(workingTime);
        ShiftClickingTime clickingTime = ShiftClickingTime.builder()
                .startTime(shiftDTO.getClickingTime().getStartTime())
                .endTime(shiftDTO.getClickingTime().getEndTime())
                .build();
        shift.setClickingTime(clickingTime);
        List<DailyShift> dailyShiftList = new ArrayList<>();
        for (DailyShiftDTO dailyShiftDTO : shiftDTO.getDailyShiftList()) {
            DailyShift dailyShift = DailyShift.builder()
                    .date(dailyShiftDTO.getDate())
                    .note(dailyShiftDTO.getNote())
                    .build();
            List<ShiftAttendanceRecord> attendanceRecordList = new ArrayList<>();
            for (ShiftAttendanceRecordDTO shiftAttendanceRecordDTO : dailyShiftDTO.getAttendanceList()) {
                ShiftAttendanceRecord shiftAttendanceRecord = ShiftAttendanceRecord.builder()
                        .hasAttend(shiftAttendanceRecordDTO.isHasAttend())
                        .date(shiftAttendanceRecordDTO.getDate())
                        .timeIn(shiftAttendanceRecordDTO.getTimeIn())
                        .timeOut(shiftAttendanceRecordDTO.getTimeOut())
                        .note(shiftAttendanceRecordDTO.getNote())
                        .staffId(shiftAttendanceRecordDTO.getStaffId())
                        .build();
                attendanceRecordList.add(shiftAttendanceRecord);
            }
            dailyShift.setAttendanceList(attendanceRecordList);
            dailyShiftList.add(dailyShift);
        }
        shift.setDailyShifts(dailyShiftList);
        shift = shiftRepository.save(shift);
        shiftDTO = modelMapper.map(shift, ShiftDTO.class);
        for (DailyShiftDTO dailyShiftDTO : shiftDTO.getDailyShiftList()) {
            dailyShiftDTO.setShiftId(shiftDTO.getId());
            dailyShiftDTO.setShiftName(shiftDTO.getName());
            for (ShiftAttendanceRecordDTO shiftAttendanceRecordDTO : dailyShiftDTO.getAttendanceList()) {
                shiftAttendanceRecordDTO.setStaffName(staffRepository.findById(shiftAttendanceRecordDTO.getStaffId()).orElseThrow().getName());
            }
        }
        return shiftDTO;
    }

    @Override
    public void deleteShift(int shiftId) {
        shiftRepository.deleteById(shiftId);
    }
}
