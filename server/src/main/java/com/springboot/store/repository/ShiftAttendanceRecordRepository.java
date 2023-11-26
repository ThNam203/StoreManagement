package com.springboot.store.repository;

import com.springboot.store.entity.ShiftAttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShiftAttendanceRecordRepository extends JpaRepository<ShiftAttendanceRecord, Integer> {
}
