package com.springboot.store.service.impl;

import com.springboot.store.entity.ShiftAttendanceRecord;
import com.springboot.store.entity.StaffBonusSalary;
import com.springboot.store.entity.StaffPunishSalary;
import com.springboot.store.payload.ShiftAttendanceRecordDTO;
import com.springboot.store.payload.StaffBonusSalaryDTO;
import com.springboot.store.payload.StaffPunishSalaryDTO;
import com.springboot.store.repository.ShiftAttendanceRecordRepository;
import com.springboot.store.repository.StaffBonusSalaryRepository;
import com.springboot.store.repository.StaffPunishSalaryRepository;
import com.springboot.store.service.ShiftAttendanceRecordService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShiftAttendanceRecordServiceImpl implements ShiftAttendanceRecordService {
    private final ShiftAttendanceRecordRepository shiftAttendanceRecordRepository;
    private final ModelMapper modelMapper;
    private final StaffBonusSalaryRepository staffBonusSalaryRepository;
    private final StaffPunishSalaryRepository staffPunishSalaryRepository;

    @Override
    public ShiftAttendanceRecordDTO getShiftAttendanceRecord(int id) {
        ShiftAttendanceRecord shiftAttendanceRecord = shiftAttendanceRecordRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("ShiftAttendanceRecord not found with id: " + id));
        return modelMapper.map(shiftAttendanceRecord, ShiftAttendanceRecordDTO.class);
    }

    @Override
    public ShiftAttendanceRecordDTO createShiftAttendanceRecord(ShiftAttendanceRecordDTO shiftAttendanceRecordDTO) {
        ShiftAttendanceRecord shiftAttendanceRecord = ShiftAttendanceRecord.builder()
                .staffId(shiftAttendanceRecordDTO.getStaffId())
                .hasAttend(shiftAttendanceRecordDTO.isHasAttend())
                .date(shiftAttendanceRecordDTO.getDate())
                .note(shiftAttendanceRecordDTO.getNote())
                .build();
        List<StaffBonusSalary> bonusSalaryList = new ArrayList<>();
        for (StaffBonusSalaryDTO bonusSalaryDTO : shiftAttendanceRecordDTO.getBonusSalaryList()) {
            StaffBonusSalary bonusSalary = modelMapper.map(bonusSalaryDTO, StaffBonusSalary.class);
            bonusSalary.setShiftAttendanceRecord(shiftAttendanceRecord);
            bonusSalaryList.add(bonusSalary);
        }
        shiftAttendanceRecord.setBonusSalaryList(bonusSalaryList);
        List<StaffPunishSalary> punishSalaryList = new ArrayList<>();
        for (StaffPunishSalaryDTO punishSalaryDTO : shiftAttendanceRecordDTO.getPunishSalaryList()) {
            StaffPunishSalary punishSalary = modelMapper.map(punishSalaryDTO, StaffPunishSalary.class);
            punishSalary.setShiftAttendanceRecord(shiftAttendanceRecord);
            punishSalaryList.add(punishSalary);
        }
        shiftAttendanceRecord.setPunishSalaryList(punishSalaryList);
        shiftAttendanceRecord = shiftAttendanceRecordRepository.save(shiftAttendanceRecord);
        return modelMapper.map(shiftAttendanceRecord, ShiftAttendanceRecordDTO.class);
    }

    @Override
    public ShiftAttendanceRecordDTO updateShiftAttendanceRecord(int id, ShiftAttendanceRecordDTO shiftAttendanceRecordDTO) {
        ShiftAttendanceRecord existingShiftAttendanceRecord = shiftAttendanceRecordRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("ShiftAttendanceRecord not found with id: " + id));
        existingShiftAttendanceRecord.setStaffId(shiftAttendanceRecordDTO.getStaffId());
        existingShiftAttendanceRecord.setHasAttend(shiftAttendanceRecordDTO.isHasAttend());
        existingShiftAttendanceRecord.setDate(shiftAttendanceRecordDTO.getDate());
        existingShiftAttendanceRecord.setNote(shiftAttendanceRecordDTO.getNote());
        List<StaffBonusSalary> bonusSalaryList = new ArrayList<>();
        for (StaffBonusSalaryDTO bonusSalaryDTO : shiftAttendanceRecordDTO.getBonusSalaryList()) {
            StaffBonusSalary bonusSalary = modelMapper.map(bonusSalaryDTO, StaffBonusSalary.class);
            bonusSalary.setShiftAttendanceRecord(existingShiftAttendanceRecord);
            bonusSalaryList.add(bonusSalary);
        }
        existingShiftAttendanceRecord.setBonusSalaryList(bonusSalaryList);
        List<StaffPunishSalary> punishSalaryList = new ArrayList<>();
        for (StaffPunishSalaryDTO punishSalaryDTO : shiftAttendanceRecordDTO.getPunishSalaryList()) {
            StaffPunishSalary punishSalary = modelMapper.map(punishSalaryDTO, StaffPunishSalary.class);
            punishSalary.setShiftAttendanceRecord(existingShiftAttendanceRecord);
            punishSalaryList.add(punishSalary);
        }
        existingShiftAttendanceRecord.setPunishSalaryList(punishSalaryList);
        existingShiftAttendanceRecord = shiftAttendanceRecordRepository.save(existingShiftAttendanceRecord);
        return modelMapper.map(existingShiftAttendanceRecord, ShiftAttendanceRecordDTO.class);
    }

    @Override
    public void deleteShiftAttendanceRecord(int id) {
        shiftAttendanceRecordRepository.deleteById(id);
    }
}
