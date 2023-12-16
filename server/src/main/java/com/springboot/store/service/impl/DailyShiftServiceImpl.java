package com.springboot.store.service.impl;

import com.springboot.store.entity.*;
import com.springboot.store.payload.DailyShiftDTO;
import com.springboot.store.payload.ShiftAttendanceRecordDTO;
import com.springboot.store.payload.StaffBonusSalaryDTO;
import com.springboot.store.payload.StaffPunishSalaryDTO;
import com.springboot.store.repository.*;
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
    private final StaffRepository staffRepository;
    private final ShiftAttendanceRecordRepository shiftAttendanceRecordRepository;
    private final StaffBonusSalaryRepository staffBonusSalaryRepository;
    private final StaffPunishSalaryRepository staffPunishSalaryRepository;

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
        //check if attendance record list is empty then delete daily shift
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
        if (dailyShiftDTO.getAttendanceList().isEmpty()) {
            deleteDailyShift(dailyShiftId);
            return null;
        }
        dailyShiftDTO = modelMapper.map(existingDailyShift, DailyShiftDTO.class);
        for (ShiftAttendanceRecordDTO shiftAttendanceRecordDTO : dailyShiftDTO.getAttendanceList()) {
            shiftAttendanceRecordDTO.setStaffName(staffRepository.findById(shiftAttendanceRecordDTO.getStaffId()).orElseThrow().getName());
        }
        Shift shift = shiftRepository.findById(dailyShiftDTO.getShiftId()).orElseThrow();
        List<DailyShift> dailyShiftList = dailyShiftRepository.findByStoreIdAndShiftId(shift.getStore().getId(), shift.getId());
        shift.setDailyShifts(dailyShiftList);
        shiftRepository.save(shift);
        return dailyShiftDTO;
    }

    @Override
    public DailyShift createDailyShift(DailyShiftDTO dailyShiftDTO) {
        Staff staff = staffService.getAuthorizedStaff();
        DailyShift dailyShift = DailyShift.builder()
                .date(dailyShiftDTO.getDate())
                .note(dailyShiftDTO.getNote())
                .build();
        List<ShiftAttendanceRecord> attendanceRecordList = new ArrayList<>();
        for (ShiftAttendanceRecordDTO shiftAttendanceRecordDTO : dailyShiftDTO.getAttendanceList()) {
            ShiftAttendanceRecord shiftAttendanceRecord = ShiftAttendanceRecord.builder()
                    .staffId(shiftAttendanceRecordDTO.getStaffId())
                    .hasAttend(shiftAttendanceRecordDTO.isHasAttend())
                    .date(shiftAttendanceRecordDTO.getDate())
                    .note(shiftAttendanceRecordDTO.getNote())
                    .build();
            if (shiftAttendanceRecordDTO.getBonusSalaryList() != null) {
                List<StaffBonusSalary> bonusSalaryList = new ArrayList<>();
                for (StaffBonusSalaryDTO staffBonusSalaryDTO : shiftAttendanceRecordDTO.getBonusSalaryList()) {
                    StaffBonusSalary staffBonusSalary = StaffBonusSalary.builder()
                            .value(staffBonusSalaryDTO.getValue())
                            .name(staffBonusSalaryDTO.getName())
                            .multiply(staffBonusSalaryDTO.getMultiply())
                            .build();
                    staffBonusSalary.setShiftAttendanceRecord(shiftAttendanceRecord);
                    staffBonusSalary.setStore(staff.getStore());
                    bonusSalaryList.add(staffBonusSalary);
                }
                shiftAttendanceRecord.setBonusSalaryList(bonusSalaryList);
            }
            if (shiftAttendanceRecordDTO.getPunishSalaryList() != null) {
                List<StaffPunishSalary> punishSalaryList = new ArrayList<>();
                for (StaffPunishSalaryDTO staffPunishSalaryDTO : shiftAttendanceRecordDTO.getPunishSalaryList()) {
                    StaffPunishSalary staffPunishSalary = StaffPunishSalary.builder()
                            .value(staffPunishSalaryDTO.getValue())
                            .name(staffPunishSalaryDTO.getName())
                            .multiply(staffPunishSalaryDTO.getMultiply())
                            .build();
                    staffPunishSalary.setShiftAttendanceRecord(shiftAttendanceRecord);
                    staffPunishSalary.setStore(staff.getStore());
                    punishSalaryList.add(staffPunishSalary);
                }
                shiftAttendanceRecord.setPunishSalaryList(punishSalaryList);
            }
            shiftAttendanceRecord.setStore(staff.getStore());
            shiftAttendanceRecord.setDailyShift(dailyShift);
            attendanceRecordList.add(shiftAttendanceRecord);
        }
        dailyShift.setStore(staff.getStore());
        dailyShift.setShift(shiftRepository.findById(dailyShiftDTO.getShiftId()).orElseThrow());
        dailyShift.setAttendanceList(attendanceRecordList);
        dailyShift = dailyShiftRepository.save(dailyShift);
        Shift shift = dailyShift.getShift();
        shift.getDailyShifts().add(dailyShift);
        shiftRepository.save(shift);
        return dailyShift;
    }

    @Override
    public List<DailyShiftDTO> createDailyShifts(List<DailyShiftDTO> dailyShiftDTOList) {
        Staff staff = staffService.getAuthorizedStaff();
        List<DailyShift> dailyShiftList = new ArrayList<>();
        for (DailyShiftDTO dailyShiftDTO : dailyShiftDTOList) {
            DailyShift dailyShift = DailyShift.builder()
                    .date(dailyShiftDTO.getDate())
                    .note(dailyShiftDTO.getNote())
                    .build();
            List<ShiftAttendanceRecord> attendanceRecordList = new ArrayList<>();
            for (ShiftAttendanceRecordDTO shiftAttendanceRecordDTO : dailyShiftDTO.getAttendanceList()) {
                ShiftAttendanceRecord shiftAttendanceRecord = ShiftAttendanceRecord.builder()
                        .staffId(shiftAttendanceRecordDTO.getStaffId())
                        .hasAttend(shiftAttendanceRecordDTO.isHasAttend())
                        .date(shiftAttendanceRecordDTO.getDate())
                        .note(shiftAttendanceRecordDTO.getNote())
                        .build();
                if (shiftAttendanceRecordDTO.getBonusSalaryList() != null) {
                    List<StaffBonusSalary> bonusSalaryList = new ArrayList<>();
                    for (StaffBonusSalaryDTO staffBonusSalaryDTO : shiftAttendanceRecordDTO.getBonusSalaryList()) {
                        StaffBonusSalary staffBonusSalary = StaffBonusSalary.builder()
                                .value(staffBonusSalaryDTO.getValue())
                                .name(staffBonusSalaryDTO.getName())
                                .multiply(staffBonusSalaryDTO.getMultiply())
                                .build();
                        staffBonusSalary.setShiftAttendanceRecord(shiftAttendanceRecord);
                        staffBonusSalary.setStore(staff.getStore());
                        bonusSalaryList.add(staffBonusSalary);
                    }
                    shiftAttendanceRecord.setBonusSalaryList(bonusSalaryList);
                }
                if (shiftAttendanceRecordDTO.getPunishSalaryList() != null) {
                    List<StaffPunishSalary> punishSalaryList = new ArrayList<>();
                    for (StaffPunishSalaryDTO staffPunishSalaryDTO : shiftAttendanceRecordDTO.getPunishSalaryList()) {
                        StaffPunishSalary staffPunishSalary = StaffPunishSalary.builder()
                                .value(staffPunishSalaryDTO.getValue())
                                .name(staffPunishSalaryDTO.getName())
                                .multiply(staffPunishSalaryDTO.getMultiply())
                                .build();
                        staffPunishSalary.setShiftAttendanceRecord(shiftAttendanceRecord);
                        staffPunishSalary.setStore(staff.getStore());
                        punishSalaryList.add(staffPunishSalary);
                    }
                    shiftAttendanceRecord.setPunishSalaryList(punishSalaryList);
                }
                shiftAttendanceRecord.setStore(staff.getStore());
                shiftAttendanceRecord.setDailyShift(dailyShift);
                attendanceRecordList.add(shiftAttendanceRecord);
            }
            dailyShift.setStore(staff.getStore());
            dailyShift.setShift(shiftRepository.findById(dailyShiftDTO.getShiftId()).orElseThrow());
            dailyShift.setAttendanceList(attendanceRecordList);
            dailyShiftList.add(dailyShift);
        }
        dailyShiftList = dailyShiftRepository.saveAll(dailyShiftList);

        List<DailyShiftDTO> dailyShiftDTOList1 = new ArrayList<>();
        for (DailyShift dailyShift : dailyShiftList) {
            DailyShiftDTO dailyShiftDTO = modelMapper.map(dailyShift, DailyShiftDTO.class);
            for (ShiftAttendanceRecordDTO shiftAttendanceRecordDTO : dailyShiftDTO.getAttendanceList()) {
                shiftAttendanceRecordDTO.setStaffName(staffRepository.findById(shiftAttendanceRecordDTO.getStaffId()).orElseThrow().getName());
            }
            dailyShiftDTOList1.add(dailyShiftDTO);
        }
        List<Shift> listShift = shiftRepository.findByStoreId(staff.getStore().getId());
        for (Shift shift : listShift) {
            List<DailyShift> dailyShiftList1 = dailyShiftRepository.findByStoreIdAndShiftId(shift.getStore().getId(), shift.getId());
            shift.setDailyShifts(dailyShiftList1);
            shiftRepository.save(shift);
        }
        return dailyShiftDTOList1;
    }

    @Override
    public List<DailyShiftDTO> updateDailyShifts(List<DailyShiftDTO> dailyShiftDTOList) {
        List<DailyShift> dailyShiftList = new ArrayList<>();
        for (DailyShiftDTO dailyShiftDTO : dailyShiftDTOList) {
            if (dailyShiftDTO.getId() == -1) {
                DailyShift dailyShift = createDailyShift(dailyShiftDTO);
                dailyShiftList.add(dailyShift);
            } else {
                int id = dailyShiftDTO.getId();
                if (dailyShiftDTO.getAttendanceList().isEmpty()) {
                    deleteDailyShift(id);
                    return null;
                }
                DailyShift existingDailyShift = dailyShiftRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("DailyShift not found with id: " + id));
                existingDailyShift.setDate(dailyShiftDTO.getDate());
                existingDailyShift.setNote(dailyShiftDTO.getNote());
                existingDailyShift.setShift(shiftRepository.findById(dailyShiftDTO.getShiftId()).orElseThrow());
                List<ShiftAttendanceRecord> attendanceRecordListToDelete = existingDailyShift.getAttendanceList();
                for (ShiftAttendanceRecord attendanceRecord : attendanceRecordListToDelete) {
                    // Remove the association with the daily shift
                    attendanceRecord.setDailyShift(null);
                    attendanceRecord.setStore(null);
                    // Get all bonus salary records of this attendance record
                    List<StaffBonusSalary> bonusSalaryList = attendanceRecord.getBonusSalaryList();
                    attendanceRecord.setBonusSalaryList(null);
                    List<StaffPunishSalary> punishSalaryList = attendanceRecord.getPunishSalaryList();
                    attendanceRecord.setPunishSalaryList(null);

                    for (StaffBonusSalary bonusSalary : bonusSalaryList) {
                        // Remove the association with the attendance record
                        bonusSalary.setShiftAttendanceRecord(null);
                        bonusSalary.setStore(null);
                        staffBonusSalaryRepository.deleteById(bonusSalary.getId());
                    }
                    // Get all punish salary records of this attendance record
                    for (StaffPunishSalary punishSalary : punishSalaryList) {
                        // Remove the association with the attendance record
                        punishSalary.setShiftAttendanceRecord(null);
                        punishSalary.setStore(null);
                        staffPunishSalaryRepository.deleteById(punishSalary.getId());
                    }
                    shiftAttendanceRecordRepository.deleteById(attendanceRecord.getId());
                }

                List<ShiftAttendanceRecord> attendanceRecordList = new ArrayList<>();
                for (ShiftAttendanceRecordDTO shiftAttendanceRecordDTO : dailyShiftDTO.getAttendanceList()) {
                    ShiftAttendanceRecord shiftAttendanceRecord = modelMapper.map(shiftAttendanceRecordDTO, ShiftAttendanceRecord.class);
                    List<StaffBonusSalary> bonusSalaryList = new ArrayList<>();
                    for (StaffBonusSalaryDTO staffBonusSalaryDTO : shiftAttendanceRecordDTO.getBonusSalaryList()) {
                        StaffBonusSalary staffBonusSalary = modelMapper.map(staffBonusSalaryDTO, StaffBonusSalary.class);
                        staffBonusSalary.setShiftAttendanceRecord(shiftAttendanceRecord);
                        staffBonusSalary.setStore(staffService.getAuthorizedStaff().getStore());
                        bonusSalaryList.add(staffBonusSalary);
                    }
                    shiftAttendanceRecord.setBonusSalaryList(bonusSalaryList);
                    List<StaffPunishSalary> punishSalaryList = new ArrayList<>();
                    for (StaffPunishSalaryDTO staffPunishSalaryDTO : shiftAttendanceRecordDTO.getPunishSalaryList()) {
                        StaffPunishSalary staffPunishSalary = modelMapper.map(staffPunishSalaryDTO, StaffPunishSalary.class);
                        staffPunishSalary.setShiftAttendanceRecord(shiftAttendanceRecord);
                        staffPunishSalary.setStore(staffService.getAuthorizedStaff().getStore());
                        punishSalaryList.add(staffPunishSalary);
                    }
                    shiftAttendanceRecord.setPunishSalaryList(punishSalaryList);
                    shiftAttendanceRecord.setStore(staffService.getAuthorizedStaff().getStore());
                    shiftAttendanceRecord.setDailyShift(existingDailyShift);
                    attendanceRecordList.add(shiftAttendanceRecord);
                }
                existingDailyShift.setAttendanceList(attendanceRecordList);
                existingDailyShift = dailyShiftRepository.save(existingDailyShift);

                dailyShiftList.add(existingDailyShift);
            }

        }
        dailyShiftList = dailyShiftRepository.saveAll(dailyShiftList);
        List<DailyShiftDTO> dailyShiftDTOList1 = new ArrayList<>();
        for (DailyShift dailyShift : dailyShiftList) {
            DailyShiftDTO dailyShiftDTO = modelMapper.map(dailyShift, DailyShiftDTO.class);
            for (ShiftAttendanceRecordDTO shiftAttendanceRecordDTO : dailyShiftDTO.getAttendanceList()) {
                shiftAttendanceRecordDTO.setStaffName(staffRepository.findById(shiftAttendanceRecordDTO.getStaffId()).orElseThrow().getName());
            }
            dailyShiftDTOList1.add(dailyShiftDTO);
        }
        List<Shift> listShift = shiftRepository.findByStoreId(staffService.getAuthorizedStaff().getStore().getId());
        for (Shift shift : listShift) {
            List<DailyShift> dailyShiftList1 = dailyShiftRepository.findByStoreIdAndShiftId(shift.getStore().getId(), shift.getId());
            shift.setDailyShifts(dailyShiftList1);
            shiftRepository.save(shift);
        }
        return dailyShiftDTOList1;
    }

    @Override
    public void deleteDailyShift(int dailyShiftId) {
        DailyShift existingDailyShift = dailyShiftRepository.findById(dailyShiftId).orElseThrow(() -> new EntityNotFoundException("DailyShift not found with id: " + dailyShiftId));
        List<ShiftAttendanceRecord> attendanceRecordListToDelete = existingDailyShift.getAttendanceList();
        for (ShiftAttendanceRecord attendanceRecord : attendanceRecordListToDelete) {
            // Remove the association with the daily shift
            attendanceRecord.setDailyShift(null);
            attendanceRecord.setStore(null);
            // Get all bonus salary records of this attendance record
            List<StaffBonusSalary> bonusSalaryList = attendanceRecord.getBonusSalaryList();
            attendanceRecord.setBonusSalaryList(null);
            List<StaffPunishSalary> punishSalaryList = attendanceRecord.getPunishSalaryList();
            attendanceRecord.setPunishSalaryList(null);

            for (StaffBonusSalary bonusSalary : bonusSalaryList) {
                // Remove the association with the attendance record
                bonusSalary.setShiftAttendanceRecord(null);
                bonusSalary.setStore(null);
                staffBonusSalaryRepository.deleteById(bonusSalary.getId());
            }
            // Get all punish salary records of this attendance record
            for (StaffPunishSalary punishSalary : punishSalaryList) {
                // Remove the association with the attendance record
                punishSalary.setShiftAttendanceRecord(null);
                punishSalary.setStore(null);
                staffPunishSalaryRepository.deleteById(punishSalary.getId());
            }
            shiftAttendanceRecordRepository.deleteById(attendanceRecord.getId());
        }
        Shift shift = existingDailyShift.getShift();
        shift.getDailyShifts().remove(existingDailyShift);
        shiftRepository.save(shift);
        dailyShiftRepository.deleteById(dailyShiftId);
    }
}
