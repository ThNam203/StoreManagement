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

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoleSetting(@PathVariable int id) {
        return ResponseEntity.ok(roleSettingService.getRoleSetting(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> savePermission(@PathVariable int id, @RequestBody RoleSettingDTO roleSettingDTO) {
        return ResponseEntity.ok(roleSettingService.savePermission(id, roleSettingDTO));
    }

    @GetMapping
    public ResponseEntity<?> getAllRoleSetting() {
        return ResponseEntity.ok(roleSettingService.getAllRoleSetting());
    }

    @PostMapping
    public ResponseEntity<?> createRoleSetting(@RequestBody RoleSettingDTO roleSettingDTO) {
        return ResponseEntity.ok(roleSettingService.createRoleSetting(roleSettingDTO));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoleSetting(@PathVariable int id) {
        roleSettingService.deleteRoleSetting(id);
        return ResponseEntity.ok("Role setting deleted successfully");

    }
}
