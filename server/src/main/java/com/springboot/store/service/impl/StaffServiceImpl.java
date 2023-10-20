package com.springboot.store.service.impl;

import com.springboot.store.entity.Staff;
import com.springboot.store.exception.CustomException;
import com.springboot.store.exception.ResourceNotFoundException;
import com.springboot.store.payload.StaffRequest;
import com.springboot.store.payload.StaffResponse;
import com.springboot.store.repository.StaffRepository;
import com.springboot.store.repository.StaffRoleRepository;
import com.springboot.store.service.StaffService;
import com.springboot.store.utils.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {
    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;
    private final StaffRoleRepository staffRoleRepository;

    @Override
    public StaffResponse createStaff(StaffRequest newStaff, Staff creator) {
        // check if staff is valid
        isStaffValid(newStaff);

        // check if creator is admin
        if (creator.getStaffRole().getName() != Role.ADMIN) {
            throw new CustomException("Only admin can create staff", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        // convert DTO to entity
        Staff staff = mapToEntity(newStaff);
        staff.setPassword(passwordEncoder.encode(newStaff.getPassword()));
        staff.setCreatedAt(new Date());
        staff.setCreator(creator);

//         save entity to database
        staff = staffRepository.save(Objects.requireNonNull(staff));

//         convert entity to DTO
        return mapToResponse(staff);
    }

    @Override
    public List<StaffResponse> getAllStaffs() {
        List<Staff> staffs = staffRepository.findAll();

        return staffs.stream().map(this::mapToResponse).toList();
    }

    @Override
    public StaffResponse getStaffById(int id) {
        Staff staff = staffRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Staff", "id", id));
        return mapToResponse(staff);
    }

    @Override
    public StaffResponse updateStaff(int id, StaffRequest staffRequest, Staff creator) {
        Staff staff = staffRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Staff", "id", id));

        // check if staff is valid
        isStaffValid(staffRequest);

        // check if role changed and if creator is admin
        if (staffRequest.getRole() != null && !staffRequest.getRole().equals(staff.getStaffRole().getName())
                && creator.getStaffRole().getName() != Role.ADMIN) {
            throw new CustomException("Only admin can change staff role", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        staff.setName(staffRequest.getName());
        staff.setAddress(staffRequest.getAddress());
        staff.setPhoneNumber(staffRequest.getPhoneNumber());
        staff.setFacebook(staffRequest.getFacebook());
        staff.setAvatar(staffRequest.getAvatar());
        staff.setDescription(staffRequest.getDescription());
        staff.setSex(staffRequest.getSex());
        staff.setBirthday(staffRequest.getBirthday());

        staff = staffRepository.save(staff);

        return mapToResponse(staff);
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


    private StaffResponse mapToResponse(Staff staff) {
        return StaffResponse.builder()
                .id(staff.getId())
                .name(staff.getName())
                .email(staff.getEmail())
                .address(staff.getAddress())
                .phoneNumber(staff.getPhoneNumber())
                .facebook(staff.getFacebook())
                .avatar(staff.getAvatar())
                .description(staff.getDescription())
                .birthday(staff.getBirthday())
                // if staffRole is not null, get name of staffRole
                .role(staff.getStaffRole() != null ? staff.getStaffRole().getName() : null)
                .createdAt(staff.getCreatedAt())
                // if creator is not null, get name of creator
                .creator(staff.getCreator() != null ? staff.getCreator().getName() : null)
                .build();
    }
    private Staff mapToEntity(StaffRequest staffRequest) {
        return Staff.builder()
                .id(staffRequest.getId())
                .name(staffRequest.getName())
                .email(staffRequest.getEmail())
                .password(staffRequest.getPassword())
                .address(staffRequest.getAddress())
                .phoneNumber(staffRequest.getPhoneNumber())
                .facebook(staffRequest.getFacebook())
                .avatar(staffRequest.getAvatar())
                .description(staffRequest.getDescription())
                .sex(staffRequest.getSex())
                .birthday(staffRequest.getBirthday())
                .staffRole(staffRequest.getRole() != null
                        ? staffRoleRepository.findByName(staffRequest.getRole()).orElseThrow()
                        : null)
                .build();
    }
    private void isStaffValid(StaffRequest newStaff) {
        // check if email is already in use
        if (staffRepository.existsByEmail(newStaff.getEmail())) {
            throw new CustomException("Email already in use", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        // check if role is valid
        if (newStaff.getRole() != null && !staffRoleRepository.existsByName(newStaff.getRole())) {
            throw new CustomException("Role is invalid", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        // check if password is valid
        if (newStaff.getPassword().length() < 6) {
            throw new CustomException("Password must be at least 6 characters", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        // check if birthday is valid
        if (newStaff.getBirthday() != null && newStaff.getBirthday().after(new Date())) {
            throw new CustomException("Birthday is invalid", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        // check if role is valid
        if (newStaff.getRole() != null && !staffRoleRepository.existsByName(newStaff.getRole())) {
            throw new CustomException("Role is invalid", HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }
}
