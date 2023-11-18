package com.springboot.store.service.impl;

import com.springboot.store.entity.StaffSaturdayBonus;
import com.springboot.store.payload.StaffSaturdayBonusDTO;
import com.springboot.store.repository.StaffSaturdayBonusRepository;
import com.springboot.store.service.StaffSaturdayBonusService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffSaturdayBonusServiceImpl implements StaffSaturdayBonusService {
    private final ModelMapper modelMapper;
    private final StaffSaturdayBonusRepository staffSaturdayBonusRepository;

    @Override
    public StaffSaturdayBonusDTO getStaffSaturdayBonus(int id) {
        StaffSaturdayBonus staffSaturdayBonus = staffSaturdayBonusRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("StaffSaturdayBonus not found with id: " + id));
        return modelMapper.map(staffSaturdayBonus, StaffSaturdayBonusDTO.class);
    }

    @Override
    public StaffSaturdayBonusDTO createStaffSaturdayBonus(StaffSaturdayBonusDTO staffSaturdayBonusDTO) {
        StaffSaturdayBonus staffSaturdayBonus = modelMapper.map(staffSaturdayBonusDTO, StaffSaturdayBonus.class);
        staffSaturdayBonus = staffSaturdayBonusRepository.save(staffSaturdayBonus);
        return modelMapper.map(staffSaturdayBonus, StaffSaturdayBonusDTO.class);
    }

    @Override
    public StaffSaturdayBonusDTO updateStaffSaturdayBonus(int id, StaffSaturdayBonusDTO staffSaturdayBonusDTO) {
        StaffSaturdayBonus existingStaffSaturdayBonus = staffSaturdayBonusRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("StaffSaturdayBonus not found with id: " + id));
        existingStaffSaturdayBonus.setValue(staffSaturdayBonusDTO.getValue());
        existingStaffSaturdayBonus.setBonusUnit(staffSaturdayBonusDTO.getBonusUnit());
        existingStaffSaturdayBonus = staffSaturdayBonusRepository.save(existingStaffSaturdayBonus);
        return modelMapper.map(existingStaffSaturdayBonus, StaffSaturdayBonusDTO.class);
    }

    @Override
    public void deleteStaffSaturdayBonus(int id) {
        staffSaturdayBonusRepository.deleteById(id);
    }
}
