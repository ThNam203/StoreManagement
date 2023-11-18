package com.springboot.store.service.impl;

import com.springboot.store.entity.*;
import com.springboot.store.payload.StaffBaseSalaryBonusDTO;
import com.springboot.store.repository.StaffBaseSalaryBonusRepository;
import com.springboot.store.service.StaffBaseSalaryBonusService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffBaseSalaryBonusServiceImpl implements StaffBaseSalaryBonusService {
    private final StaffBaseSalaryBonusRepository staffBaseSalaryBonusRepository;
    private final ModelMapper modelMapper;

    @Override
    public StaffBaseSalaryBonusDTO getStaffBaseSalaryBonus(int id) {
        StaffBaseSalaryBonus staffBaseSalaryBonus = staffBaseSalaryBonusRepository.findById(id).orElseThrow(() -> new RuntimeException("StaffBaseSalaryBonus not found with id: " + id));
        return modelMapper.map(staffBaseSalaryBonus, StaffBaseSalaryBonusDTO.class);
    }

    @Override
    public StaffBaseSalaryBonusDTO createStaffBaseSalaryBonus(StaffBaseSalaryBonusDTO staffBaseSalaryBonusDTO) {
        StaffBaseSalaryBonus staffBaseSalaryBonus = modelMapper.map(staffBaseSalaryBonusDTO, StaffBaseSalaryBonus.class);
        staffBaseSalaryBonus = staffBaseSalaryBonusRepository.save(staffBaseSalaryBonus);
        return modelMapper.map(staffBaseSalaryBonus, StaffBaseSalaryBonusDTO.class);
    }

    @Override
    public StaffBaseSalaryBonusDTO updateStaffBaseSalaryBonus(int id, StaffBaseSalaryBonusDTO staffBaseSalaryBonusDTO) {
        StaffBaseSalaryBonus existingStaffBaseSalaryBonus = staffBaseSalaryBonusRepository.findById(id).orElseThrow(() -> new RuntimeException("StaffBaseSalaryBonus not found with id: " + id));
        if (staffBaseSalaryBonusDTO.getStaffDayOffBonus() != null) {
            if (staffBaseSalaryBonusDTO.getStaffDayOffBonus().getBonusUnit() != null)
                existingStaffBaseSalaryBonus.getStaffDayOffBonus().setBonusUnit(staffBaseSalaryBonusDTO.getStaffDayOffBonus().getBonusUnit());
            if (staffBaseSalaryBonusDTO.getStaffDayOffBonus().getValue() != null)
                existingStaffBaseSalaryBonus.getStaffDayOffBonus().setValue(staffBaseSalaryBonusDTO.getStaffDayOffBonus().getValue());
        }
        if (staffBaseSalaryBonusDTO.getStaffHolidayBonus() != null) {
            if (staffBaseSalaryBonusDTO.getStaffHolidayBonus().getBonusUnit() != null)
                existingStaffBaseSalaryBonus.getStaffHolidayBonus().setBonusUnit(staffBaseSalaryBonusDTO.getStaffHolidayBonus().getBonusUnit());
            if (staffBaseSalaryBonusDTO.getStaffHolidayBonus().getValue() != null)
                existingStaffBaseSalaryBonus.getStaffHolidayBonus().setValue(staffBaseSalaryBonusDTO.getStaffHolidayBonus().getValue());
        }
        if (staffBaseSalaryBonusDTO.getStaffSaturdayBonus() != null) {
            if (staffBaseSalaryBonusDTO.getStaffSaturdayBonus().getBonusUnit() != null)
                existingStaffBaseSalaryBonus.getStaffSaturdayBonus().setBonusUnit(staffBaseSalaryBonusDTO.getStaffSaturdayBonus().getBonusUnit());
            if (staffBaseSalaryBonusDTO.getStaffSaturdayBonus().getValue() != null)
                existingStaffBaseSalaryBonus.getStaffSaturdayBonus().setValue(staffBaseSalaryBonusDTO.getStaffSaturdayBonus().getValue());
        }
        if (staffBaseSalaryBonusDTO.getStaffSundayBonus() != null) {
            if (staffBaseSalaryBonusDTO.getStaffSundayBonus().getBonusUnit() != null)
                existingStaffBaseSalaryBonus.getStaffSundayBonus().setBonusUnit(staffBaseSalaryBonusDTO.getStaffSundayBonus().getBonusUnit());
            if (staffBaseSalaryBonusDTO.getStaffSundayBonus().getValue() != null)
                existingStaffBaseSalaryBonus.getStaffSundayBonus().setValue(staffBaseSalaryBonusDTO.getStaffSundayBonus().getValue());
        }
        existingStaffBaseSalaryBonus = staffBaseSalaryBonusRepository.save(existingStaffBaseSalaryBonus);
        return modelMapper.map(existingStaffBaseSalaryBonus, StaffBaseSalaryBonusDTO.class);
    }

    @Override
    public void deleteStaffBaseSalaryBonus(int id) {
        staffBaseSalaryBonusRepository.deleteById(id);
    }
}
