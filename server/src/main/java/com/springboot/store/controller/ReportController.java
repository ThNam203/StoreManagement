package com.springboot.store.controller;

import com.springboot.store.payload.ListBonusAndPunishForStaffDTO;
import com.springboot.store.payload.RecordOfProductSellDTO;
import com.springboot.store.service.ListBonusAndPunishForStaffService;
import com.springboot.store.service.RecordOfProductSellService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ListBonusAndPunishForStaffService listBonusAndPunishForStaffService;
    private final RecordOfProductSellService recordOfProductSellService;

    @GetMapping("/bonus-and-punish")
    public ResponseEntity<List<ListBonusAndPunishForStaffDTO>> getAllListBonusAndPunishForStaff() {
        List<ListBonusAndPunishForStaffDTO> listBonusAndPunishForStaffDTOs = listBonusAndPunishForStaffService.getAllListBonusAndPunishForStaff();
        return ResponseEntity.ok(listBonusAndPunishForStaffDTOs);
    }

    @GetMapping("/record-of-product-sell/{date}")
    public ResponseEntity<List<RecordOfProductSellDTO>> getAllRecordOfProductSell(@PathVariable String date) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date date1 = formatter.parse(date, new java.text.ParsePosition(0));
        List<RecordOfProductSellDTO> recordOfProductSellDTOs = recordOfProductSellService.getAllRecordOfProductSell(date1);
        return ResponseEntity.ok(recordOfProductSellDTOs);
    }
}
