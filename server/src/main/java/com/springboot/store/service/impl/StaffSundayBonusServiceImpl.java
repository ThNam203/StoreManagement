package com.springboot.store.service.impl;

import com.springboot.store.entity.StaffSaturdayBonus;
import com.springboot.store.entity.StaffSundayBonus;
import com.springboot.store.payload.StaffSundayBonusDTO;
import com.springboot.store.repository.StaffSundayBonusRepository;
import com.springboot.store.service.StaffSundayBonusService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffSundayBonusServiceImpl implements StaffSundayBonusService {
    private final ModelMapper modelMapper;
    private final StaffSundayBonusRepository staffSundayBonusRepository;

    @Override
    public StaffSundayBonusDTO getStaffSundayBonus(int id) {
        StaffSundayBonus staffSaturdayBonus = staffSundayBonusRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("StaffSundayBonus not found with id: " + id));
        return modelMapper.map(staffSaturdayBonus, StaffSundayBonusDTO.class);
    }

    @Override
    public StaffSundayBonusDTO createStaffSundayBonus(StaffSundayBonusDTO staffSundayBonusDTO) {
        StaffSundayBonus staffSundayBonus = modelMapper.map(staffSundayBonusDTO, StaffSundayBonus.class);
        staffSundayBonus = staffSundayBonusRepository.save(staffSundayBonus);
        return modelMapper.map(staffSundayBonus, StaffSundayBonusDTO.class);
    }

    @Override
    public StaffSundayBonusDTO updateStaffSundayBonus(int id, StaffSundayBonusDTO staffSundayBonusDTO) {
        StaffSundayBonus existingStaffSundayBonus = staffSundayBonusRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("StaffSundayBonus not found with id: " + id));
        existingStaffSundayBonus.setValue(staffSundayBonusDTO.getValue());
        existingStaffSundayBonus.setBonusUnit(staffSundayBonusDTO.getBonusUnit());
        existingStaffSundayBonus = staffSundayBonusRepository.save(existingStaffSundayBonus);
        return modelMapper.map(existingStaffSundayBonus, StaffSundayBonusDTO.class);
    }

    @Override
    public void deleteStaffSundayBonus(int id) {
        staffSundayBonusRepository.deleteById(id);
    }
}
