package com.springboot.store.service.impl;

import com.springboot.store.entity.ShiftAttendanceRecord;
import com.springboot.store.entity.Staff;
import com.springboot.store.entity.StaffBonusSalary;
import com.springboot.store.entity.StaffPunishSalary;
import com.springboot.store.payload.*;
import com.springboot.store.repository.ShiftAttendanceRecordRepository;
import com.springboot.store.repository.StaffRepository;
import com.springboot.store.service.ListBonusAndPunishForStaffService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ListBonusAndPunishForStaffServiceImpl implements ListBonusAndPunishForStaffService {
    private final ShiftAttendanceRecordRepository shiftAttendanceRecordRepository;
    private final StaffRepository staffRepository;
    private final ModelMapper modelMapper;
    private final StaffService staffService;

    @Override
    public List<ListBonusAndPunishForStaffDTO> getAllListBonusAndPunishForStaff() {
        Staff staff = staffService.getAuthorizedStaff();
        List<Integer> staffIds = staffRepository.findAllStaffIdByStoreId(staff.getStore().getId());
        List<ListBonusAndPunishForStaffDTO> listReturn = new ArrayList<>();
        for (Integer staffId : staffIds) {
            ListBonusAndPunishForStaffDTO listBonusAndPunishForStaffDTO = new ListBonusAndPunishForStaffDTO();
            listBonusAndPunishForStaffDTO.setStaffId(staffId);
            List<ShiftAttendanceRecord> shiftAttendanceRecords = shiftAttendanceRecordRepository.findByStaffIdAndDateInThisMonthAndBonusAndPunishNotNull(staffId);
            Map<String, ListBonusForStaffDTO> bonusMap = new HashMap<>();
            Map<String, ListPunishForStaffDTO> punishMap = new HashMap<>();
            for (ShiftAttendanceRecord shiftAttendanceRecord : shiftAttendanceRecords) {
                if (shiftAttendanceRecord.getBonusSalaryList() != null) {
                    for (StaffBonusSalary staffBonusSalary : shiftAttendanceRecord.getBonusSalaryList()) {
                        ListBonusForStaffDTO bonus = bonusMap.computeIfAbsent(staffBonusSalary.getName(), name -> createNewBonusForStaffDTO(name, staffBonusSalary));
                        updateBonusForStaffDTO(bonus, staffBonusSalary);
                    }
                }
                if (shiftAttendanceRecord.getPunishSalaryList() != null) {
                    for (StaffPunishSalary staffPunishSalary : shiftAttendanceRecord.getPunishSalaryList()) {
                        ListPunishForStaffDTO punish = punishMap.computeIfAbsent(staffPunishSalary.getName(), name -> createNewPunishForStaffDTO(name, staffPunishSalary));
                        updatePunishForStaffDTO(punish, staffPunishSalary);
                    }
                }
            }
            listBonusAndPunishForStaffDTO.setListBonus(new ArrayList<>(bonusMap.values()));
            listBonusAndPunishForStaffDTO.setListPunish(new ArrayList<>(punishMap.values()));
            listReturn.add(listBonusAndPunishForStaffDTO);
        }
        return listReturn;
    }

    private ListBonusForStaffDTO createNewBonusForStaffDTO(String name, StaffBonusSalary staffBonusSalary) {
        return new ListBonusForStaffDTO(name, 1, staffBonusSalary.getValue() * staffBonusSalary.getMultiply());
    }

    private void updateBonusForStaffDTO(ListBonusForStaffDTO bonus, StaffBonusSalary staffBonusSalary) {
        bonus.setValue(bonus.getValue() + staffBonusSalary.getValue() * staffBonusSalary.getMultiply());
        bonus.setMultiply(bonus.getMultiply() + 1);
    }

    private ListPunishForStaffDTO createNewPunishForStaffDTO(String name, StaffPunishSalary staffPunishSalary) {
        return new ListPunishForStaffDTO(name, 1, staffPunishSalary.getValue() * staffPunishSalary.getMultiply());
    }

    private void updatePunishForStaffDTO(ListPunishForStaffDTO punish, StaffPunishSalary staffPunishSalary) {
        punish.setValue(punish.getValue() + staffPunishSalary.getValue() * staffPunishSalary.getMultiply());
        punish.setMultiply(punish.getMultiply() + 1);
    }

}
