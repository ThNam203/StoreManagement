package com.springboot.store.service.impl;

import com.springboot.store.entity.StaffRole;
import com.springboot.store.repository.StaffRoleRepository;
import com.springboot.store.service.StaffRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffRoleServiceImpl implements StaffRoleService {
    private final StaffRoleRepository staffRoleRepository;

    @Override
    public StaffRole createStaffRole(StaffRole staffRole) {
        return staffRoleRepository.save(staffRole);
    }

    @Override
    public StaffRole updateStaffRole(StaffRole staffRole) {
        StaffRole role = staffRoleRepository.findById(staffRole.getId()).orElseThrow();
        role.setName(staffRole.getName());
        role.setDescription(staffRole.getDescription());
        role.setPermission(staffRole.getPermission());
        return staffRoleRepository.save(role);
    }

    @Override
    public StaffRole getStaffRoleById(int id) {
        return staffRoleRepository.findById(id).orElseThrow();
    }

    @Override
    public void deleteStaffRoleById(int id) {
        staffRoleRepository.deleteById(id);
    }
}
