package com.springboot.store.service;

import com.springboot.store.entity.ActivityLog;
import com.springboot.store.entity.Staff;
import com.springboot.store.payload.ActivityLogDTO;

import java.util.Date;
import java.util.List;

public interface ActivityLogService {
    void save(String description, int staffId, Date date);

    List<ActivityLogDTO> getLogs();

}
