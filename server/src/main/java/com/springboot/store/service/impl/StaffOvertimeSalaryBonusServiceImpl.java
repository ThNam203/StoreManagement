package com.springboot.store.service.impl;

import com.springboot.store.entity.StaffOvertimeSalaryBonus;
import com.springboot.store.payload.StaffOvertimeSalaryBonusDTO;
import com.springboot.store.repository.StaffOvertimeSalaryBonusRepository;
import com.springboot.store.service.StaffOvertimeSalaryBonusService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffOvertimeSalaryBonusServiceImpl implements StaffOvertimeSalaryBonusService {
    private final StaffOvertimeSalaryBonusRepository staffOvertimeSalaryBonusRepository;
    private final ModelMapper modelMapper;

    @Override
    public StaffOvertimeSalaryBonusDTO getStaffOvertimeSalaryBonus(int id) {
        StaffOvertimeSalaryBonus staffOvertimeSalaryBonus = staffOvertimeSalaryBonusRepository.findById(id).orElseThrow(() -> new RuntimeException("StaffOvertimeSalaryBonus not found with id: " + id));
        return modelMapper.map(staffOvertimeSalaryBonus, StaffOvertimeSalaryBonusDTO.class);
    }

    @Override
    public StaffOvertimeSalaryBonusDTO createStaffOvertimeSalaryBonus(StaffOvertimeSalaryBonusDTO staffOvertimeSalaryBonusDTO) {
        StaffOvertimeSalaryBonus staffOvertimeSalaryBonus = modelMapper.map(staffOvertimeSalaryBonusDTO, StaffOvertimeSalaryBonus.class);
        staffOvertimeSalaryBonus = staffOvertimeSalaryBonusRepository.save(staffOvertimeSalaryBonus);
        return modelMapper.map(staffOvertimeSalaryBonus, StaffOvertimeSalaryBonusDTO.class);
    }

    @Override
    public StaffOvertimeSalaryBonusDTO updateStaffOvertimeSalaryBonus(int id, StaffOvertimeSalaryBonusDTO staffOvertimeSalaryBonusDTO) {
        StaffOvertimeSalaryBonus existingStaffOvertimeSalaryBonus = staffOvertimeSalaryBonusRepository.findById(id).orElseThrow(() -> new RuntimeException("StaffOvertimeSalaryBonus not found with id: " + id));
        if (staffOvertimeSalaryBonusDTO.getStaffDayOffBonus() != null) {
            if (staffOvertimeSalaryBonusDTO.getStaffDayOffBonus().getBonusUnit() != null)
                existingStaffOvertimeSalaryBonus.getStaffDayOffBonus().setBonusUnit(staffOvertimeSalaryBonusDTO.getStaffDayOffBonus().getBonusUnit());
            if (staffOvertimeSalaryBonusDTO.getStaffDayOffBonus().getValue() != null)
                existingStaffOvertimeSalaryBonus.getStaffDayOffBonus().setValue(staffOvertimeSalaryBonusDTO.getStaffDayOffBonus().getValue());
        }
        if (staffOvertimeSalaryBonusDTO.getStaffHolidayBonus() != null) {
            if (staffOvertimeSalaryBonusDTO.getStaffHolidayBonus().getBonusUnit() != null)
                existingStaffOvertimeSalaryBonus.getStaffHolidayBonus().setBonusUnit(staffOvertimeSalaryBonusDTO.getStaffHolidayBonus().getBonusUnit());
            if (staffOvertimeSalaryBonusDTO.getStaffHolidayBonus().getValue() != null)
                existingStaffOvertimeSalaryBonus.getStaffHolidayBonus().setValue(staffOvertimeSalaryBonusDTO.getStaffHolidayBonus().getValue());
        }
        if (staffOvertimeSalaryBonusDTO.getStaffSaturdayBonus() != null) {
            if (staffOvertimeSalaryBonusDTO.getStaffSaturdayBonus().getBonusUnit() != null)
                existingStaffOvertimeSalaryBonus.getStaffSaturdayBonus().setBonusUnit(staffOvertimeSalaryBonusDTO.getStaffSaturdayBonus().getBonusUnit());
            if (staffOvertimeSalaryBonusDTO.getStaffSaturdayBonus().getValue() != null)
                existingStaffOvertimeSalaryBonus.getStaffSaturdayBonus().setValue(staffOvertimeSalaryBonusDTO.getStaffSaturdayBonus().getValue());
        }
        if (staffOvertimeSalaryBonusDTO.getStaffSundayBonus() != null) {
            if (staffOvertimeSalaryBonusDTO.getStaffSundayBonus().getBonusUnit() != null)
                existingStaffOvertimeSalaryBonus.getStaffSundayBonus().setBonusUnit(staffOvertimeSalaryBonusDTO.getStaffSundayBonus().getBonusUnit());
            if (staffOvertimeSalaryBonusDTO.getStaffSundayBonus().getValue() != null)
                existingStaffOvertimeSalaryBonus.getStaffSundayBonus().setValue(staffOvertimeSalaryBonusDTO.getStaffSundayBonus().getValue());
        }
        existingStaffOvertimeSalaryBonus = staffOvertimeSalaryBonusRepository.save(existingStaffOvertimeSalaryBonus);
        return modelMapper.map(existingStaffOvertimeSalaryBonus, StaffOvertimeSalaryBonusDTO.class);
    }

    @Override
    public void deleteStaffOvertimeSalaryBonus(int id) {
        staffOvertimeSalaryBonusRepository.deleteById(id);
    }
}
