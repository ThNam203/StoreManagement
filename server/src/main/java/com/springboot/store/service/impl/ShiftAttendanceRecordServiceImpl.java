package com.springboot.store.service.impl;

import com.springboot.store.entity.ShiftAttendanceRecord;
import com.springboot.store.payload.ShiftAttendanceRecordDTO;
import com.springboot.store.repository.ShiftAttendanceRecordRepository;
import com.springboot.store.service.ShiftAttendanceRecordService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShiftAttendanceRecordServiceImpl implements ShiftAttendanceRecordService {
    private final ShiftAttendanceRecordRepository shiftAttendanceRecordRepository;
    private final ModelMapper modelMapper;

    @Override
    public ShiftAttendanceRecordDTO getShiftAttendanceRecord(int id) {
        ShiftAttendanceRecord shiftAttendanceRecord = shiftAttendanceRecordRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("ShiftAttendanceRecord not found with id: " + id));
        return modelMapper.map(shiftAttendanceRecord, ShiftAttendanceRecordDTO.class);
    }

    @Override
    public ShiftAttendanceRecordDTO createShiftAttendanceRecord(ShiftAttendanceRecordDTO shiftAttendanceRecordDTO) {
        ShiftAttendanceRecord shiftAttendanceRecord = modelMapper.map(shiftAttendanceRecordDTO, ShiftAttendanceRecord.class);
        shiftAttendanceRecord = shiftAttendanceRecordRepository.save(shiftAttendanceRecord);
        return modelMapper.map(shiftAttendanceRecord, ShiftAttendanceRecordDTO.class);
    }

    @Override
    public ShiftAttendanceRecordDTO updateShiftAttendanceRecord(int id, ShiftAttendanceRecordDTO shiftAttendanceRecordDTO) {
        ShiftAttendanceRecord existingShiftAttendanceRecord = shiftAttendanceRecordRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("ShiftAttendanceRecord not found with id: " + id));
        existingShiftAttendanceRecord.setStaffId(shiftAttendanceRecordDTO.getStaffId());
        existingShiftAttendanceRecord.setHasAttend(shiftAttendanceRecordDTO.isHasAttend());
        existingShiftAttendanceRecord.setStaffName(shiftAttendanceRecordDTO.getStaffName());
        existingShiftAttendanceRecord.setDate(shiftAttendanceRecordDTO.getDate());
        existingShiftAttendanceRecord.setNote(shiftAttendanceRecordDTO.getNote());
        existingShiftAttendanceRecord.setTimeIn(shiftAttendanceRecordDTO.getTimeIn());
        existingShiftAttendanceRecord.setTimeOut(shiftAttendanceRecordDTO.getTimeOut());
        existingShiftAttendanceRecord = shiftAttendanceRecordRepository.save(existingShiftAttendanceRecord);
        return modelMapper.map(existingShiftAttendanceRecord, ShiftAttendanceRecordDTO.class);
    }

    @Override
    public void deleteShiftAttendanceRecord(int id) {
        shiftAttendanceRecordRepository.deleteById(id);
    }
}
