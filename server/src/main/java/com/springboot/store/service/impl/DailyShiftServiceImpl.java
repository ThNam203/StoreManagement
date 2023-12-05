package com.springboot.store.service.impl;

import com.springboot.store.entity.DailyShift;
import com.springboot.store.entity.Shift;
import com.springboot.store.entity.ShiftAttendanceRecord;
import com.springboot.store.entity.Staff;
import com.springboot.store.payload.DailyShiftDTO;
import com.springboot.store.payload.ShiftAttendanceRecordDTO;
import com.springboot.store.repository.DailyShiftRepository;
import com.springboot.store.repository.ShiftAttendanceRecordRepository;
import com.springboot.store.repository.ShiftRepository;
import com.springboot.store.service.DailyShiftService;
import com.springboot.store.service.StaffService;
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
    private final ShiftRepository shiftRepository;
    private final ModelMapper modelMapper;
    private final StaffService staffService;

    @Override
    public DailyShiftDTO getDailyShift(int dailyShiftId) {
        DailyShift dailyShift = dailyShiftRepository.findById(dailyShiftId).orElseThrow(() -> new EntityNotFoundException("DailyShift not found with id: " + dailyShiftId));
        return modelMapper.map(dailyShift, DailyShiftDTO.class);
    }

    @Override
    public List<DailyShiftDTO> getAllDailyShifts() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<DailyShift> dailyShifts = dailyShiftRepository.findByStoreId(storeId);
        return dailyShifts.stream()
                .map((dailyShift) -> {
                    DailyShiftDTO dailyShiftDTO = modelMapper.map(dailyShift, DailyShiftDTO.class);
                    dailyShiftDTO.setShiftId(dailyShift.getShift().getId());
                    dailyShiftDTO.setShiftName(dailyShift.getShift().getName());
                    List<ShiftAttendanceRecordDTO> attendanceRecordDTOList = new ArrayList<>();
                    for (ShiftAttendanceRecord shiftAttendanceRecord : dailyShift.getAttendanceList()) {
                        ShiftAttendanceRecordDTO shiftAttendanceRecordDTO = modelMapper.map(shiftAttendanceRecord, ShiftAttendanceRecordDTO.class);
                        attendanceRecordDTOList.add(shiftAttendanceRecordDTO);
                    }
                    dailyShiftDTO.setAttendanceList(attendanceRecordDTOList);
                    return dailyShiftDTO;
                })
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public DailyShiftDTO updateDailyShift(int dailyShiftId, DailyShiftDTO dailyShiftDTO) {
        DailyShift existingDailyShift = dailyShiftRepository.findById(dailyShiftId).orElseThrow(() -> new EntityNotFoundException("DailyShift not found with id: " + dailyShiftId));
        existingDailyShift.setDate(dailyShiftDTO.getDate());
        existingDailyShift.setNote(dailyShiftDTO.getNote());
        existingDailyShift.setShift(shiftRepository.findById(dailyShiftDTO.getShiftId()).orElseThrow());
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
        Staff staff = staffService.getAuthorizedStaff();
        DailyShift dailyShift = DailyShift.builder()
                .date(dailyShiftDTO.getDate())
                .note(dailyShiftDTO.getNote())
                .build();
        List<ShiftAttendanceRecord> attendanceRecordList = new ArrayList<>();
        for (ShiftAttendanceRecordDTO shiftAttendanceRecordDTO : dailyShiftDTO.getAttendanceList()) {
            ShiftAttendanceRecord shiftAttendanceRecord = modelMapper.map(shiftAttendanceRecordDTO, ShiftAttendanceRecord.class);
            attendanceRecordList.add(shiftAttendanceRecord);
        }
        dailyShift.setStore(staff.getStore());
        dailyShift.setShift(shiftRepository.findById(dailyShiftDTO.getShiftId()).orElseThrow());
        dailyShift.setAttendanceList(attendanceRecordList);
        dailyShift = dailyShiftRepository.save(dailyShift);
        Shift shift = dailyShift.getShift();
        shift.getDailyShifts().add(dailyShift);
        shiftRepository.save(shift);
        return modelMapper.map(dailyShift, DailyShiftDTO.class);
    }

    @Override
    public void deleteDailyShift(int dailyShiftId) {
        dailyShiftRepository.deleteById(dailyShiftId);
    }
}
