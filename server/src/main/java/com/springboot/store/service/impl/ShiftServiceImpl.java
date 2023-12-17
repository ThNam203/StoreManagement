package com.springboot.store.service.impl;

import com.springboot.store.entity.*;
import com.springboot.store.payload.DailyShiftDTO;
import com.springboot.store.payload.ShiftAttendanceRecordDTO;
import com.springboot.store.payload.ShiftDTO;
import com.springboot.store.repository.*;
import com.springboot.store.service.DailyShiftService;
import com.springboot.store.service.ShiftService;
import com.springboot.store.service.StaffService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ShiftServiceImpl implements ShiftService {
    private final ShiftRepository shiftRepository;
    private final ModelMapper modelMapper;
    private final StaffRepository staffRepository;
    private final DailyShiftRepository dailyShiftRepository;
    private final ShiftAttendanceRecordRepository shiftAttendanceRecordRepository;
    private final StaffBonusSalaryRepository staffBonusSalaryRepository;
    private final StaffPunishSalaryRepository staffPunishSalaryRepository;
    private final StaffService staffService;

    @Override
    public ShiftDTO getShift(int shiftId) {
        Shift shift = shiftRepository.findById(shiftId).orElseThrow(() -> new EntityNotFoundException("Shift not found with id: " + shiftId));
        return modelMapper.map(shift, ShiftDTO.class);
    }

    @Override
    public List<ShiftDTO> getAllShifts() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<Shift> shifts = shiftRepository.findByStoreId(storeId);
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
    public List<ShiftDTO> getAllShiftsInMonth() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<Shift> shifts = shiftRepository.findByStoreId(storeId);
        List<ShiftDTO> shiftDTOs = new ArrayList<>();

        for (Shift shift : shifts) {
            ShiftDTO shiftDTO = modelMapper.map(shift, ShiftDTO.class);
            List<DailyShiftDTO> dailyShiftDTOList = new ArrayList<>(shiftDTO.getDailyShiftList());
            Iterator<DailyShiftDTO> iterator = dailyShiftDTOList.iterator();

            while (iterator.hasNext()) {
                DailyShiftDTO dailyShiftDTO = iterator.next();
                if (dailyShiftDTO.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().getMonth() != LocalDate.now().getMonth()) {
                    iterator.remove();
                } else {
                    dailyShiftDTO.setShiftId(shiftDTO.getId());
                    dailyShiftDTO.setShiftName(shiftDTO.getName());

                    for (ShiftAttendanceRecordDTO shiftAttendanceRecordDTO : dailyShiftDTO.getAttendanceList()) {
                        shiftAttendanceRecordDTO.setStaffName(staffRepository.findById(shiftAttendanceRecordDTO.getStaffId()).orElseThrow().getName());
                    }
                }
            }
            shiftDTO.setDailyShiftList(dailyShiftDTOList);
            shiftDTOs.add(shiftDTO);
        }
        return shiftDTOs;
    }

    @Override
    public List<ShiftDTO> getAllShiftsInRange(Date startDate, Date endDate) {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<Shift> shifts = shiftRepository.findByStoreId(storeId);
        List<ShiftDTO> shiftDTOs = new ArrayList<>();

        for (Shift shift : shifts) {
            ShiftDTO shiftDTO = modelMapper.map(shift, ShiftDTO.class);
            List<DailyShiftDTO> dailyShiftDTOList = new ArrayList<>(shiftDTO.getDailyShiftList());
            Iterator<DailyShiftDTO> iterator = dailyShiftDTOList.iterator();

            while (iterator.hasNext()) {
                DailyShiftDTO dailyShiftDTO = iterator.next();
                if (dailyShiftDTO.getDate().before(startDate) || dailyShiftDTO.getDate().after(endDate)) {
                    iterator.remove();
                } else {
                    dailyShiftDTO.setShiftId(shiftDTO.getId());
                    dailyShiftDTO.setShiftName(shiftDTO.getName());

                    for (ShiftAttendanceRecordDTO shiftAttendanceRecordDTO : dailyShiftDTO.getAttendanceList()) {
                        shiftAttendanceRecordDTO.setStaffName(staffRepository.findById(shiftAttendanceRecordDTO.getStaffId()).orElseThrow().getName());
                    }
                }
            }
            shiftDTO.setDailyShiftList(dailyShiftDTOList);
            shiftDTOs.add(shiftDTO);
        }
        return shiftDTOs;
    }


    @Override
    public ShiftDTO updateShift(int shiftId, ShiftDTO shiftDTO) {
        Shift existingShift = shiftRepository.findById(shiftId).orElseThrow(() -> new EntityNotFoundException("Shift not found with id: " + shiftId));
        existingShift.setName(shiftDTO.getName());
        existingShift.setStatus(shiftDTO.getStatus());
        existingShift.setStore(staffService.getAuthorizedStaff().getStore());
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
        Staff staff = staffService.getAuthorizedStaff();
        Shift shift = Shift.builder()
                .name(shiftDTO.getName())
                .status(shiftDTO.getStatus())
                .store(staff.getStore())
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
        shift = shiftRepository.save(shift);
        shiftDTO = modelMapper.map(shift, ShiftDTO.class);

        return shiftDTO;
    }

    @Override
    public void deleteShift(int shiftId) {
        // Get the shift
        Shift shift = shiftRepository.findById(shiftId).orElseThrow();
        // Get all daily shifts of this shift
        List<DailyShift> dailyShifts = shift.getDailyShifts();
        shift.setStore(null);
        shift.setDailyShifts(null);

        for (DailyShift dailyShift : dailyShifts) {
            // Get all attendance records of this daily shift
            List<ShiftAttendanceRecord> attendanceRecords = dailyShift.getAttendanceList();
            dailyShift.setShift(null);
            dailyShift.setStore(null);
            dailyShift.setAttendanceList(null);
            for (ShiftAttendanceRecord attendanceRecord : attendanceRecords) {
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
            dailyShiftRepository.deleteById(dailyShift.getId());
        }
        shiftRepository.deleteById(shiftId);
    }
}
