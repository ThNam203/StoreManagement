package com.springboot.store.controller;

import com.springboot.store.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/activity-logs")
@RequiredArgsConstructor
public class ActivityLogController {
    private final ActivityLogService activityLogService;
    
    @GetMapping
    public ResponseEntity<?> getAllActivityLogs() {
        return ResponseEntity.ok(activityLogService.getLogs());
    }

}
