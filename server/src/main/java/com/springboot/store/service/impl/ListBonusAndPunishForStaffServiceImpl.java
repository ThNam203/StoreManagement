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
import java.util.List;

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
            List<ShiftAttendanceRecord> shiftAttendanceRecords = shiftAttendanceRecordRepository.findByStaffId(staffId);
            List<ListBonusForStaffDTO> listBonus = new ArrayList<>();
            List<ListPunishForStaffDTO> listPunish = new ArrayList<>();
            // get list bonus and punish
            for (ShiftAttendanceRecord shiftAttendanceRecord : shiftAttendanceRecords) {
                if (shiftAttendanceRecord.getBonusSalaryList() != null) {
                    for (StaffBonusSalary staffBonusSalary : shiftAttendanceRecord.getBonusSalaryList()) {
                        if (listBonus.isEmpty()) {
                            ListBonusForStaffDTO listBonusForStaffDTO = new ListBonusForStaffDTO();
                            listBonusForStaffDTO.setName(staffBonusSalary.getName());
                            listBonusForStaffDTO.setValue(staffBonusSalary.getValue() * staffBonusSalary.getMultiply());
                            listBonusForStaffDTO.setMultiply(listBonusForStaffDTO.getMultiply() + 1);
                            listBonus.add(listBonusForStaffDTO);
                        } else {
                            boolean check = false;
                            for (ListBonusForStaffDTO listBonusForStaffDTO : listBonus) {
                                if (listBonusForStaffDTO.getName().equals(staffBonusSalary.getName())) {
                                    listBonusForStaffDTO.setValue(listBonusForStaffDTO.getValue() + staffBonusSalary.getValue() * staffBonusSalary.getMultiply());
                                    listBonusForStaffDTO.setMultiply(listBonusForStaffDTO.getMultiply() + 1);
                                    check = true;
                                    break;
                                }
                            }
                            if (!check) {
                                ListBonusForStaffDTO listBonusForStaffDTO = new ListBonusForStaffDTO();
                                listBonusForStaffDTO.setName(staffBonusSalary.getName());
                                listBonusForStaffDTO.setValue(staffBonusSalary.getValue() * staffBonusSalary.getMultiply());
                                listBonusForStaffDTO.setMultiply(listBonusForStaffDTO.getMultiply() + 1);
                                listBonus.add(listBonusForStaffDTO);
                            }
                        }

                    }
                }
                if (shiftAttendanceRecord.getPunishSalaryList() != null) {
                    for (StaffPunishSalary staffPunishSalary : shiftAttendanceRecord.getPunishSalaryList()) {
                        if (listPunish.isEmpty()) {
                            ListPunishForStaffDTO listPunishForStaffDTO = new ListPunishForStaffDTO();
                            listPunishForStaffDTO.setName(staffPunishSalary.getName());
                            listPunishForStaffDTO.setValue(staffPunishSalary.getValue() * staffPunishSalary.getMultiply());
                            listPunishForStaffDTO.setMultiply(listPunishForStaffDTO.getMultiply() + 1);
                            listPunish.add(listPunishForStaffDTO);
                        } else {
                            boolean check = false;
                            for (ListPunishForStaffDTO listPunishForStaffDTO : listPunish) {
                                if (listPunishForStaffDTO.getName().equals(staffPunishSalary.getName())) {
                                    listPunishForStaffDTO.setValue(listPunishForStaffDTO.getValue() + staffPunishSalary.getValue() * staffPunishSalary.getMultiply());
                                    listPunishForStaffDTO.setMultiply(listPunishForStaffDTO.getMultiply() + 1);
                                    check = true;
                                    break;
                                }
                            }
                            if (!check) {
                                ListPunishForStaffDTO listPunishForStaffDTO = new ListPunishForStaffDTO();
                                listPunishForStaffDTO.setName(staffPunishSalary.getName());
                                listPunishForStaffDTO.setValue(staffPunishSalary.getValue() * staffPunishSalary.getMultiply());
                                listPunishForStaffDTO.setMultiply(listPunishForStaffDTO.getMultiply() + 1);
                                listPunish.add(listPunishForStaffDTO);
                            }
                        }

                    }
                }
            }
            listBonusAndPunishForStaffDTO.setListBonus(listBonus);
            listBonusAndPunishForStaffDTO.setListPunish(listPunish);
            listReturn.add(listBonusAndPunishForStaffDTO);
        }
        return listReturn;
    }
}
