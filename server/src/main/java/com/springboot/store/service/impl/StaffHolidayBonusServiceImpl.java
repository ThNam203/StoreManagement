package com.springboot.store.service.impl;

import com.springboot.store.entity.StaffHolidayBonus;
import com.springboot.store.payload.StaffHolidayBonusDTO;
import com.springboot.store.repository.StaffHolidayBonusRepository;
import com.springboot.store.service.StaffHolidayBonusService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffHolidayBonusServiceImpl implements StaffHolidayBonusService {
    private final StaffHolidayBonusRepository staffHolidayBonusRepository;
    private final ModelMapper modelMapper;

    @Override
    public StaffHolidayBonusDTO getStaffHolidayBonus(int id) {
        StaffHolidayBonus staffHolidayBonus = staffHolidayBonusRepository.findById(id).orElseThrow(() -> new RuntimeException("StaffHolidayBonus not found with id: " + id));
        return modelMapper.map(staffHolidayBonus, StaffHolidayBonusDTO.class);
    }

    @Override
    public StaffHolidayBonusDTO createStaffHolidayBonus(StaffHolidayBonusDTO staffHolidayBonusDTO) {
        StaffHolidayBonus staffHolidayBonus = modelMapper.map(staffHolidayBonusDTO, StaffHolidayBonus.class);
        staffHolidayBonus = staffHolidayBonusRepository.save(staffHolidayBonus);
        return modelMapper.map(staffHolidayBonus, StaffHolidayBonusDTO.class);
    }

    @Override
    public StaffHolidayBonusDTO updateStaffHolidayBonus(int id, StaffHolidayBonusDTO staffHolidayBonusDTO) {
        StaffHolidayBonus existingStaffHolidayBonus = staffHolidayBonusRepository.findById(id).orElseThrow(() -> new RuntimeException("StaffHolidayBonus not found with id: " + id));
        existingStaffHolidayBonus.setValue(staffHolidayBonusDTO.getValue());
        existingStaffHolidayBonus.setBonusUnit(staffHolidayBonusDTO.getBonusUnit());
        existingStaffHolidayBonus = staffHolidayBonusRepository.save(existingStaffHolidayBonus);
        return modelMapper.map(existingStaffHolidayBonus, StaffHolidayBonusDTO.class);
    }

    @Override
    public void deleteStaffHolidayBonus(int id) {
        staffHolidayBonusRepository.deleteById(id);
    }
}
