package com.springboot.store.repository;

import com.springboot.store.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Integer> {
}
