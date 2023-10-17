package com.springboot.store.service;

import com.springboot.store.entity.StaffRole;

public interface StaffRoleService {
    StaffRole createStaffRole(StaffRole staffRole);
    StaffRole updateStaffRole(StaffRole staffRole);
    StaffRole getStaffRoleById(int id);
    void deleteStaffRoleById(int id);
}
