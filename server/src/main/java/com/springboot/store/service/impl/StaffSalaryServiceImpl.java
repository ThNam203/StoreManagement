package com.springboot.store.service.impl;

import com.springboot.store.entity.StaffSalary;
import com.springboot.store.payload.StaffSalaryDTO;
import com.springboot.store.repository.StaffSalaryRepository;
import com.springboot.store.service.StaffSalaryService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffSalaryServiceImpl implements StaffSalaryService {
    private final StaffSalaryRepository staffSalaryRepository;
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
        existingStaffSalary.setSalary(staffSalaryDTO.getSalary());
        existingStaffSalary.setSalaryType(staffSalaryDTO.getSalaryType());
        existingStaffSalary = staffSalaryRepository.save(existingStaffSalary);
        return modelMapper.map(existingStaffSalary, StaffSalaryDTO.class);
    }

    @Override
    public void deleteStaffSalary(int id) {
        staffSalaryRepository.deleteById(id);
    }
}
