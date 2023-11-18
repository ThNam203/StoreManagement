package com.springboot.store.service.impl;

import com.springboot.store.entity.StaffBaseSalary;
import com.springboot.store.entity.StaffSalary;
import com.springboot.store.payload.StaffSalaryDTO;
import com.springboot.store.repository.StaffRepository;
import com.springboot.store.repository.StaffSalaryRepository;
import com.springboot.store.service.StaffBaseSalaryBonusService;
import com.springboot.store.service.StaffSalaryService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffSalaryServiceImpl implements StaffSalaryService {
    private final StaffSalaryRepository staffSalaryRepository;
    private final StaffBaseSalaryBonusService staffBaseSalaryBonusService;
    private final ModelMapper modelMapper;

    @Override
    public StaffSalaryDTO getStaffSalaryById(int id) {
        StaffSalary staffSalary = staffSalaryRepository.findById(id).orElseThrow(() -> new RuntimeException("Staff Salary not found with id: " + id));
        return modelMapper.map(staffSalary, StaffSalaryDTO.class);
    }

    @Override
    public StaffSalaryDTO createStaffSalary(StaffSalaryDTO staffSalaryDTO) {
        StaffSalary staffSalary = modelMapper.map(staffSalaryDTO, StaffSalary.class);
        staffSalary = staffSalaryRepository.save(staffSalary);
        return modelMapper.map(staffSalary, StaffSalaryDTO.class);
    }

    @Override
    public StaffSalaryDTO updateStaffSalary(int id, StaffSalaryDTO staffSalaryDTO) {
        StaffSalary existingStaffSalary = staffSalaryRepository.findById(id).orElseThrow(() -> new RuntimeException("Staff Salary not found with id: " + id));
        if (staffSalaryDTO.getStaffBaseSalary() != null) {
            if (staffSalaryDTO.getStaffBaseSalary().getValue() != null)
                existingStaffSalary.getStaffBaseSalary().setValue(staffSalaryDTO.getStaffBaseSalary().getValue());
            if (staffSalaryDTO.getStaffBaseSalary().getSalaryType() != null)
                existingStaffSalary.getStaffBaseSalary().setSalaryType(staffSalaryDTO.getStaffBaseSalary().getSalaryType());
        }
        if (staffSalaryDTO.getStaffBaseSalaryBonus() != null) {
            if (staffSalaryDTO.getStaffBaseSalaryBonus().getStaffDayOffBonus() != null) {
                if (staffSalaryDTO.getStaffBaseSalaryBonus().getStaffDayOffBonus().getBonusUnit() != null)
                    existingStaffSalary.getStaffBaseSalaryBonus().getStaffDayOffBonus().setBonusUnit(staffSalaryDTO.getStaffBaseSalaryBonus().getStaffDayOffBonus().getBonusUnit());
                if (staffSalaryDTO.getStaffBaseSalaryBonus().getStaffDayOffBonus().getValue() != null)
                    existingStaffSalary.getStaffBaseSalaryBonus().getStaffDayOffBonus().setValue(staffSalaryDTO.getStaffBaseSalaryBonus().getStaffDayOffBonus().getValue());
            }
            if (staffSalaryDTO.getStaffBaseSalaryBonus().getStaffHolidayBonus() != null) {
                if (staffSalaryDTO.getStaffBaseSalaryBonus().getStaffHolidayBonus().getBonusUnit() != null)
                    existingStaffSalary.getStaffBaseSalaryBonus().getStaffHolidayBonus().setBonusUnit(staffSalaryDTO.getStaffBaseSalaryBonus().getStaffHolidayBonus().getBonusUnit());
                if (staffSalaryDTO.getStaffBaseSalaryBonus().getStaffHolidayBonus().getValue() != null)
                    existingStaffSalary.getStaffBaseSalaryBonus().getStaffHolidayBonus().setValue(staffSalaryDTO.getStaffBaseSalaryBonus().getStaffHolidayBonus().getValue());
            }
            if (staffSalaryDTO.getStaffBaseSalaryBonus().getStaffSaturdayBonus() != null) {
                if (staffSalaryDTO.getStaffBaseSalaryBonus().getStaffSaturdayBonus().getBonusUnit() != null)
                    existingStaffSalary.getStaffBaseSalaryBonus().getStaffSaturdayBonus().setBonusUnit(staffSalaryDTO.getStaffBaseSalaryBonus().getStaffSaturdayBonus().getBonusUnit());
                if (staffSalaryDTO.getStaffBaseSalaryBonus().getStaffSaturdayBonus().getValue() != null)
                    existingStaffSalary.getStaffBaseSalaryBonus().getStaffSaturdayBonus().setValue(staffSalaryDTO.getStaffBaseSalaryBonus().getStaffSaturdayBonus().getValue());
            }
            if (staffSalaryDTO.getStaffBaseSalaryBonus().getStaffSundayBonus() != null) {
                if (staffSalaryDTO.getStaffBaseSalaryBonus().getStaffSundayBonus().getBonusUnit() != null)
                    existingStaffSalary.getStaffBaseSalaryBonus().getStaffSundayBonus().setBonusUnit(staffSalaryDTO.getStaffBaseSalaryBonus().getStaffSundayBonus().getBonusUnit());
                if (staffSalaryDTO.getStaffBaseSalaryBonus().getStaffSundayBonus().getValue() != null)
                    existingStaffSalary.getStaffBaseSalaryBonus().getStaffSundayBonus().setValue(staffSalaryDTO.getStaffBaseSalaryBonus().getStaffSundayBonus().getValue());
            }
        }
        if (staffSalaryDTO.getStaffOvertimeSalaryBonus() != null) {
            if (staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffDayOffBonus() != null) {
                if (staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffDayOffBonus().getBonusUnit() != null)
                    existingStaffSalary.getStaffOvertimeSalaryBonus().getStaffDayOffBonus().setBonusUnit(staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffDayOffBonus().getBonusUnit());
                if (staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffDayOffBonus().getValue() != null)
                    existingStaffSalary.getStaffOvertimeSalaryBonus().getStaffDayOffBonus().setValue(staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffDayOffBonus().getValue());
            }
            if (staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffHolidayBonus() != null) {
                if (staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffHolidayBonus().getBonusUnit() != null)
                    existingStaffSalary.getStaffOvertimeSalaryBonus().getStaffHolidayBonus().setBonusUnit(staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffHolidayBonus().getBonusUnit());
                if (staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffHolidayBonus().getValue() != null)
                    existingStaffSalary.getStaffOvertimeSalaryBonus().getStaffHolidayBonus().setValue(staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffHolidayBonus().getValue());
            }
            if (staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffSaturdayBonus() != null) {
                if (staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffSaturdayBonus().getBonusUnit() != null)
                    existingStaffSalary.getStaffOvertimeSalaryBonus().getStaffSaturdayBonus().setBonusUnit(staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffSaturdayBonus().getBonusUnit());
                if (staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffSaturdayBonus().getValue() != null)
                    existingStaffSalary.getStaffOvertimeSalaryBonus().getStaffSaturdayBonus().setValue(staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffSaturdayBonus().getValue());
            }
            if (staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffSundayBonus() != null) {
                if (staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffSundayBonus().getBonusUnit() != null)
                    existingStaffSalary.getStaffOvertimeSalaryBonus().getStaffSundayBonus().setBonusUnit(staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffSundayBonus().getBonusUnit());
                if (staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffSundayBonus().getValue() != null)
                    existingStaffSalary.getStaffOvertimeSalaryBonus().getStaffSundayBonus().setValue(staffSalaryDTO.getStaffOvertimeSalaryBonus().getStaffSundayBonus().getValue());
            }
        }
        existingStaffSalary = staffSalaryRepository.save(existingStaffSalary);
        return modelMapper.map(existingStaffSalary, StaffSalaryDTO.class);
    }

    @Override
    public void deleteStaffSalary(int id) {
        staffSalaryRepository.deleteById(id);
    }
}
