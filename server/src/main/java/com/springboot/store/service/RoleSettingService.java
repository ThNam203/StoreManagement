package com.springboot.store.service;

import com.springboot.store.entity.RoleSetting;
import com.springboot.store.payload.RoleSettingDTO;

public interface RoleSettingService {
    void savePermission(int staffId, RoleSettingDTO roleSettingDTO);
    RoleSettingDTO getRoleSetting(int staffId);
}
