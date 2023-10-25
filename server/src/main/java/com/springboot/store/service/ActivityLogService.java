package com.springboot.store.service;

import com.springboot.store.entity.ActivityLog;
import com.springboot.store.entity.Staff;

import java.util.List;

public interface ActivityLogService {
    void save(String action, String description, String actor);

    List<ActivityLog> getLogs();
}
