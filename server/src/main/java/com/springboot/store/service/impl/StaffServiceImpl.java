package com.springboot.store.service.impl;

import com.springboot.store.entity.Media;
import com.springboot.store.entity.Staff;
import com.springboot.store.exception.CustomException;
import com.springboot.store.exception.ResourceNotFoundException;
import com.springboot.store.payload.StaffRequest;
import com.springboot.store.payload.StaffResponse;
import com.springboot.store.repository.MediaRepository;
import com.springboot.store.repository.StaffRepository;
import com.springboot.store.repository.StaffRoleRepository;
import com.springboot.store.service.ActivityLogService;
import com.springboot.store.service.StaffService;
import com.springboot.store.utils.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final ActivityLogService activityLogService;
    private final MediaRepository mediaRepository;

    @Override
    public StaffResponse createStaff(StaffRequest newStaff) {
        // check if staff is valid
        isStaffValid(newStaff);

        Staff creator = getAuthorizedStaff();

        // check if creator is admin
        if (creator.getStaffRole().getName() != Role.ADMIN) {
            throw new CustomException("Only admin can create staff", HttpStatus.UNPROCESSABLE_ENTITY);
        }



        // convert DTO to entity
        Staff staff = mapToEntity(newStaff);
        staff.setPassword(passwordEncoder.encode(newStaff.getPassword()));
        staff.setCreatedAt(new Date());
        staff.setCreator(creator);

        if (newStaff.getAvatar() != null) {
            Media avatar = Media.builder()
                    .url(newStaff.getAvatar())
                    .build();
//            avatar = mediaRepository.save(avatar);
            staff.setAvatar(avatar);
        }

        // save entity to database
        staff = staffRepository.save(Objects.requireNonNull(staff));

        // save activity log
        activityLogService.save("CREATE", "Create new staff", creator.getName());

        // convert entity to DTO
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
    public StaffResponse updateStaff(int id, StaffRequest staffRequest) {
        Staff staff = staffRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Staff", "id", id));

        // check if staff is valid
        isStaffValid(staffRequest);

        Staff creator = getAuthorizedStaff();

        // check if role changed and if creator is admin
        if (staffRequest.getRole() != null && !staffRequest.getRole().equals(staff.getStaffRole().getName())
                && creator.getStaffRole().getName() != Role.ADMIN) {
            throw new CustomException("Only admin can change staff role", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        Media avatarUrl = Media.builder()
                .url(staffRequest.getAvatar())
                .build();

        staff.setName(staffRequest.getName());
        staff.setAddress(staffRequest.getAddress());
        staff.setPhoneNumber(staffRequest.getPhoneNumber());
        staff.setFacebook(staffRequest.getFacebook());
        staff.setAvatar(avatarUrl);
        staff.setNote(staffRequest.getNote());
        staff.setSex(staffRequest.getSex());
        staff.setBirthday(staffRequest.getBirthday());

        staff = staffRepository.save(staff);

        // save activity log
        activityLogService.save("UPDATE", "Update staff with id " + id, creator.getName());

        return mapToResponse(staff);
    }

    @Override
    public void deleteStaff(int id) {
        Staff creator = getAuthorizedStaff();
        Staff staff = staffRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Staff", "id", id));
        staffRepository.delete(staff);

        // save activity log
        activityLogService.save("DELETE", "Delete staff with id " + id, creator.getName());
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
                .note(staff.getNote())
                .birthday(staff.getBirthday())
                .createdAt(staff.getCreatedAt())
                .avatar(staff.getAvatar() != null ? staff.getAvatar().getUrl() : null)
                // if staffRole is not null, get name of staffRole
                .role(staff.getStaffRole() != null ? staff.getStaffRole().getName() : null)
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
                .note(staffRequest.getNote())
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

    private Staff getAuthorizedStaff() {
        return staffRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow(
            () -> new CustomException("You not found", HttpStatus.UNPROCESSABLE_ENTITY)
        );
    }
}
