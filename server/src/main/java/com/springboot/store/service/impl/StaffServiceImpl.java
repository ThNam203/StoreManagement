package com.springboot.store.service.impl;

import com.springboot.store.entity.Staff;
import com.springboot.store.entity.StaffRole;
import com.springboot.store.exception.ResourceNotFoundException;
import com.springboot.store.payload.StaffDto;
import com.springboot.store.payload.StaffRoleDto;
import com.springboot.store.repository.StaffRepository;
import com.springboot.store.service.StaffService;
import com.springboot.store.utils.Role;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class StaffServiceImpl implements StaffService {
    private StaffRepository staffRepository;
    private ModelMapper modelMapper;

    private PasswordEncoder passwordEncoder;

    // Spring will automatically inject StaffRepository instance into this constructor
    public StaffServiceImpl(StaffRepository staffRepository, ModelMapper modelMapper, PasswordEncoder passwordEncoder) {
        this.staffRepository = staffRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    public StaffDto createStaff(StaffDto newStaff, Staff creator) {
        // convert DTO to entity
        Staff staff = mapToEntity(newStaff);
//        staff.setPassword(passwordEncoder.encode(newStaff.getPassword()));
        staff.setCreatedAt(new Date());
        staff.setCreator(creator);

//         save entity to database
//        staff = staffRepository.save(Objects.requireNonNull(staff));

//         convert entity to DTO
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
    public void deleteStaff(int id, Staff creator) {
        Staff staff = staffRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Staff", "id", id));
        staffRepository.delete(staff);
    }

    @Override
    public Staff findByEmail(String email) {
        return staffRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Staff", "email", email));
    }


    private StaffDto mapToDTO(Staff staff) {
        StaffDto staffDto = modelMapper.map(staff, StaffDto.class);
        if (staff.getStaffRole() != null) {
            staffDto.setRole(staff.getStaffRole().getName());
        }
        if (staff.getCreator() != null) {
            staffDto.setCreator(staff.getCreator().getName());
        }
        return staffDto;
    }
    private Staff mapToEntity(StaffDto staffDto) {
        return modelMapper.map(staffDto, Staff.class);
    }
}
