package com.springboot.store.repository;

import com.springboot.store.entity.DailyShift;
import com.springboot.store.entity.ShiftAttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DailyShiftRepository extends JpaRepository<DailyShift, Integer> {
    List<DailyShift> findByStoreId(Integer storeId);

    List<DailyShift> findByStoreIdAndShiftId(Integer storeId, Integer shiftId);

    List<DailyShift> findByAttendanceListContaining(ShiftAttendanceRecord shiftAttendanceRecord);
}
