package com.springboot.store.service.impl;

import com.springboot.store.entity.ActivityLog;
import com.springboot.store.entity.Staff;
import com.springboot.store.repository.ActivityLogRepository;
import com.springboot.store.repository.StaffRepository;
import com.springboot.store.service.ActivityLogService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

// updated store
@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl implements ActivityLogService {
    private final ActivityLogRepository activityLogRepository;
    private final StaffRepository staffRepository;
    @Override
    public void save(String action, String description, String actor) {
        Staff staff = getAuthorizedStaff();
        ActivityLog activityLog = ActivityLog.builder()
                .action(action)
                .description(description)
                .actor(actor)
                .time(new Date())
                .store(staff.getStore())
                .build();
        activityLogRepository.save(activityLog);
    }

    @Override
    public List<ActivityLog> getLogs() {
        return activityLogRepository.findByStoreId(getAuthorizedStaff().getStore().getId());
    }
    public Staff getAuthorizedStaff() {
        return staffRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new UsernameNotFoundException("Your user not found"));
    }
}
