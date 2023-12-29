package com.springboot.store.controller;

import com.springboot.store.payload.RoleSettingDTO;
import com.springboot.store.service.RoleSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/role-setting")
public class RoleSettingController {
    private final RoleSettingService roleSettingService;

    @GetMapping("/{staffId}")
    public ResponseEntity<?> getRoleSetting(@PathVariable int staffId) {
        return ResponseEntity.ok(roleSettingService.getRoleSetting(staffId));
    }

    @PutMapping("/{staffId}")
    public ResponseEntity<?> savePermission(@PathVariable int staffId, @RequestBody RoleSettingDTO roleSettingDTO) {
        return ResponseEntity.ok(roleSettingService.getRoleSetting(staffId));
    }

    @GetMapping
    public ResponseEntity<?> getAllRoleSetting() {
        return ResponseEntity.ok(roleSettingService.getAllRoleSetting());
    }
}
