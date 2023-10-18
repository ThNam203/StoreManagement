package com.springboot.store.service.impl;

import com.springboot.store.entity.Staff;
import com.springboot.store.exception.ResourceNotFoundException;
import com.springboot.store.payload.StaffDto;
import com.springboot.store.repository.StaffRepository;
import com.springboot.store.service.StaffService;
import com.springboot.store.utils.Role;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class StaffServiceImpl implements StaffService {
    private StaffRepository staffRepository;
    private ModelMapper modelMapper;

    // Spring will automatically inject StaffRepository instance into this constructor
    public StaffServiceImpl(StaffRepository staffRepository, ModelMapper modelMapper) {
        this.staffRepository = staffRepository;
        this.modelMapper = modelMapper;
    }
    @Override
    public StaffDto createStaff(Staff staff) {
        // convert DTO to entity
//        Staff staff = mapToEntity(staffDto);

        // save entity to database
        staff = staffRepository.save(Objects.requireNonNull(staff));

        // convert entity to DTO
        return mapToDTO(staff);
    }

    @Override
    public List<StaffDto> getAllStaffs() {
        List<Staff> staffs = staffRepository.findAll();

        return staffs.stream().map(this::mapToDTO).toList();
    }

    @Override
    public StaffDto getStaffById(int id) {
        Staff staff = staffRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Staff", "id", id));
        return mapToDTO(staff);
    }

    @Override
    public StaffDto updateStaff(int id, StaffDto staffDto) {
        Staff staff = staffRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Staff", "id", id));

        staff.setName(staffDto.getName());
        staff.setAddress(staffDto.getAddress());
        staff.setPhoneNumber(staffDto.getPhoneNumber());
        staff.setFacebook(staffDto.getFacebook());
        staff.setAvatar(staffDto.getAvatar());
        staff.setDescription(staffDto.getDescription());
        staff.setSex(staffDto.getSex());
        staff.setBirthday(staffDto.getBirthday());

        staff = staffRepository.save(staff);

        return mapToDTO(staff);
    }

    @Override
    public void deleteStaff(int id) {
        Staff staff = staffRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Staff", "id", id));
        staffRepository.delete(staff);
    }

    @Override
    public Role getRoleByEmail(String email) {
        // get role of staff by email
        return staffRepository.findByEmail(email).get().getStaffRole().getName();
    }

    private StaffDto mapToDTO(Staff staff) {
        return modelMapper.map(staff, StaffDto.class);
    }
    private Staff mapToEntity(StaffDto staffDto) {
        return modelMapper.map(staffDto, Staff.class);
    }
}
