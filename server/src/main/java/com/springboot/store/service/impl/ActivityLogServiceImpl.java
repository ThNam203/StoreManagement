package com.springboot.store.service.impl;

import com.springboot.store.entity.ActivityLog;
import com.springboot.store.entity.Staff;
import com.springboot.store.payload.ActivityLogDTO;
import com.springboot.store.repository.ActivityLogRepository;
import com.springboot.store.repository.StaffRepository;
import com.springboot.store.service.ActivityLogService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
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
    private final ModelMapper modelMapper;

    @Override
    public void save(String description, int staffId, Date date) {
        Staff staff = getAuthorizedStaff();
        ActivityLog activityLog = ActivityLog.builder()
                .description(description)
                .staffId(staffId)
                .time(date)
                .store(staff.getStore())
                .build();
        activityLogRepository.save(activityLog);
    }

    @Override
    public List<ActivityLogDTO> getLogs() {
        List<ActivityLog> activityLogs = activityLogRepository.findByStoreId(getAuthorizedStaff().getStore().getId());
        return activityLogs.stream().map(activityLog -> modelMapper.map(activityLog, ActivityLogDTO.class)).toList();
    }

    public Staff getAuthorizedStaff() {
        return staffRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new UsernameNotFoundException("Your user not found"));
    }
}
