package com.springboot.store.service.impl;

import com.springboot.store.entity.StaffBaseSalary;
import com.springboot.store.payload.StaffBaseSalaryDTO;
import com.springboot.store.repository.StaffBaseSalaryRepository;
import com.springboot.store.service.StaffBaseSalaryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffBaseSalaryServiceImpl implements StaffBaseSalaryService {
    private final ModelMapper modelMapper;
    private final StaffBaseSalaryRepository staffBaseSalaryRepository;

    @Override
    public StaffBaseSalaryDTO getStaffBaseSalary(int id) {
        StaffBaseSalary staffBaseSalary = staffBaseSalaryRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("StaffBaseSalary not found with id: " + id));
        return modelMapper.map(staffBaseSalary, StaffBaseSalaryDTO.class);
    }

    @Override
    public StaffBaseSalaryDTO createStaffBaseSalary(StaffBaseSalaryDTO staffBaseSalaryDTO) {
        StaffBaseSalary staffBaseSalary = modelMapper.map(staffBaseSalaryDTO, StaffBaseSalary.class);
        staffBaseSalary = staffBaseSalaryRepository.save(staffBaseSalary);
        return modelMapper.map(staffBaseSalary, StaffBaseSalaryDTO.class);
    }

    @Override
    public StaffBaseSalaryDTO updateStaffBaseSalary(int id, StaffBaseSalaryDTO staffBaseSalaryDTO) {
        StaffBaseSalary existingStaffBaseSalary = staffBaseSalaryRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("StaffBaseSalary not found with id: " + id));
        existingStaffBaseSalary.setValue(staffBaseSalaryDTO.getValue());
        existingStaffBaseSalary.setSalaryType(staffBaseSalaryDTO.getSalaryType());
        existingStaffBaseSalary = staffBaseSalaryRepository.save(existingStaffBaseSalary);
        return modelMapper.map(existingStaffBaseSalary, StaffBaseSalaryDTO.class);
    }

    @Override
    public void deleteStaffBaseSalary(int id) {
        staffBaseSalaryRepository.deleteById(id);
    }
}
