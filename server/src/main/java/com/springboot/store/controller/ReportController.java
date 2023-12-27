package com.springboot.store.controller;

import com.springboot.store.payload.ListBonusAndPunishForStaffDTO;
import com.springboot.store.payload.RecordOfProductSellDTO;
import com.springboot.store.service.ListBonusAndPunishForStaffService;
import com.springboot.store.service.ReportService;
import com.springboot.store.service.RecordOfProductSellService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ListBonusAndPunishForStaffService listBonusAndPunishForStaffService;
    private final ReportService reportService;
    private final RecordOfProductSellService recordOfProductSellService;

    @GetMapping("/bonus-and-punish")
    public ResponseEntity<List<ListBonusAndPunishForStaffDTO>> getAllListBonusAndPunishForStaff() {
        List<ListBonusAndPunishForStaffDTO> listBonusAndPunishForStaffDTOs = listBonusAndPunishForStaffService.getAllListBonusAndPunishForStaff();
        return ResponseEntity.ok(listBonusAndPunishForStaffDTOs);
    }

    @GetMapping("/sales")
    public ResponseEntity<?> getSalesReport(
            @RequestParam(name = "start")  @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end")  @DateTimeFormat(pattern = "yyyy-MM-dd") Date end
    ) {
        return ResponseEntity.ok(reportService.getSalesReport(start, end));
    }

    @GetMapping("/sales-with-profit")
    public ResponseEntity<?> getSalesReportWithProfit(
            @RequestParam(name = "start")  @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end")  @DateTimeFormat(pattern = "yyyy-MM-dd") Date end
    ) {
        return ResponseEntity.ok(reportService.getSalesReportWithProfit(start, end));
    }

    @GetMapping("/sales-of-staff")
    public ResponseEntity<?> getSalesReportOfStaff(
            @RequestParam(name = "start")  @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end")  @DateTimeFormat(pattern = "yyyy-MM-dd") Date end
    ) {
        return ResponseEntity.ok(reportService.getSalesReportOfStaff(start, end));
    }

    @GetMapping("/sales-product-profit")
    public ResponseEntity<?> getSalesProductProfit(
            @RequestParam(name = "start")  @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end")  @DateTimeFormat(pattern = "yyyy-MM-dd") Date end
    ) {
        return ResponseEntity.ok(reportService.getSalesProductProfit(start, end));
    }

    @GetMapping("/sales-of-customer")
    public ResponseEntity<?> getSalesReportOfCustomer(
            @RequestParam(name = "start")  @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end")  @DateTimeFormat(pattern = "yyyy-MM-dd") Date end
    ) {
        return ResponseEntity.ok(reportService.getSalesReportOfCustomer(start, end));
    }

    @GetMapping("/financial-report")
    public ResponseEntity<?> getFinancialReport(
            @RequestParam(name = "start")  @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end")  @DateTimeFormat(pattern = "yyyy-MM-dd") Date end
    ) {
        return ResponseEntity.ok(reportService.getFinancialReport(start, end));
    }
    @GetMapping("/record-of-product-sell/{date}")
    public ResponseEntity<List<RecordOfProductSellDTO>> getAllRecordOfProductSell(@PathVariable String date) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date date1 = formatter.parse(date, new java.text.ParsePosition(0));
        List<RecordOfProductSellDTO> recordOfProductSellDTOs = recordOfProductSellService.getAllRecordOfProductSell(date1);
        return ResponseEntity.ok(recordOfProductSellDTOs);
    }
}
