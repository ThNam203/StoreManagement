package com.springboot.store.repository;

import com.springboot.store.entity.ShiftAttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShiftAttendanceRecordRepository extends JpaRepository<ShiftAttendanceRecord, Integer> {
    @Query("SELECT s FROM ShiftAttendanceRecord s WHERE s.staffId = :staffId AND YEAR(s.date) = YEAR(CURRENT_DATE) AND MONTH(s.date) = MONTH(CURRENT_DATE)")
    List<ShiftAttendanceRecord> findByStaffIdAndDateInThisMonth(@Param("staffId") int staffId);

    List<ShiftAttendanceRecord> findByStaffId(int staffId);
}
