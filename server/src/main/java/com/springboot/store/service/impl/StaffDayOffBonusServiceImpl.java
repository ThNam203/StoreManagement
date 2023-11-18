package com.springboot.store.service.impl;

import com.springboot.store.entity.StaffDayOffBonus;
import com.springboot.store.payload.StaffDayOffBonusDTO;
import com.springboot.store.payload.StaffHolidayBonusDTO;
import com.springboot.store.repository.StaffDayOffBonusRepository;
import com.springboot.store.service.StaffDayOffBonusService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffDayOffBonusServiceImpl implements StaffDayOffBonusService {
    private final ModelMapper modelMapper;
    private final StaffDayOffBonusRepository staffDayOffBonusRepository;

    @Override
    public StaffDayOffBonus getStaffDayOffBonus(int id) {
        StaffDayOffBonus staffDayOffBonus = staffDayOffBonusRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("StaffDayOffBonus not found with id: " + id));
        return modelMapper.map(staffDayOffBonus, StaffDayOffBonus.class);
    }

    @Override
    public StaffDayOffBonusDTO createStaffDayOffBonus(StaffDayOffBonusDTO staffDayOffBonusDTO) {
        StaffDayOffBonus staffDayOffBonus = modelMapper.map(staffDayOffBonusDTO, StaffDayOffBonus.class);
        staffDayOffBonus = staffDayOffBonusRepository.save(staffDayOffBonus);
        return modelMapper.map(staffDayOffBonus, StaffDayOffBonusDTO.class);
    }

    @Override
    public StaffDayOffBonusDTO updateStaffDayOffBonus(int id, StaffDayOffBonusDTO staffDayOffBonusDTO) {
        StaffDayOffBonus existingStaffDayOffBonus = staffDayOffBonusRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("StaffDayOffBonus not found with id: " + id));
        existingStaffDayOffBonus.setValue(staffDayOffBonusDTO.getValue());
        existingStaffDayOffBonus.setBonusUnit(staffDayOffBonusDTO.getBonusUnit());
        existingStaffDayOffBonus = staffDayOffBonusRepository.save(existingStaffDayOffBonus);
        return modelMapper.map(existingStaffDayOffBonus, StaffDayOffBonusDTO.class);
    }

    @Override
    public void deleteStaffDayOffBonus(int id) {
        staffDayOffBonusRepository.deleteById(id);
    }
}
