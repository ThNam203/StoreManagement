package com.springboot.store.service.impl;

import com.springboot.store.entity.ActivityLog;
import com.springboot.store.entity.Staff;
import com.springboot.store.repository.ActivityLogRepository;
import com.springboot.store.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl implements ActivityLogService {
    private final ActivityLogRepository activityLogRepository;
    @Override
    public void save(String action, String description, Staff staff) {
        ActivityLog activityLog = ActivityLog.builder()
                .action(action)
                .description(description)
                .staff(staff)
                .build();
        activityLogRepository.save(activityLog);
    }

    @Override
    public List<ActivityLog> getLogs() {
        return activityLogRepository.findAll();
    }
}
