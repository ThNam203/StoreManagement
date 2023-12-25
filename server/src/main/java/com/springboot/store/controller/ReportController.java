package com.springboot.store.controller;

import com.springboot.store.payload.ListBonusAndPunishForStaffDTO;
import com.springboot.store.service.ListBonusAndPunishForStaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ListBonusAndPunishForStaffService listBonusAndPunishForStaffService;

    @GetMapping("/bonus-and-punish")
    public ResponseEntity<List<ListBonusAndPunishForStaffDTO>> getAllListBonusAndPunishForStaff() {
        List<ListBonusAndPunishForStaffDTO> listBonusAndPunishForStaffDTOs = listBonusAndPunishForStaffService.getAllListBonusAndPunishForStaff();
        return ResponseEntity.ok(listBonusAndPunishForStaffDTOs);
    }
}
