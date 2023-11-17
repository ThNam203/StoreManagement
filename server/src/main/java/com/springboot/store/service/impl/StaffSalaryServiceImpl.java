package com.springboot.store.service.impl;

import com.springboot.store.entity.StaffSalary;
import com.springboot.store.payload.StaffSalaryDTO;
import com.springboot.store.repository.StaffRepository;
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
        return null;
    }

    @Override
    public StaffSalaryDTO updateStaffSalary(int id, StaffSalaryDTO staffSalaryDTO) {
        return null;
    }

    @Override
    public void deleteStaffSalary(int id) {

    }
}
