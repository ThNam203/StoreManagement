package com.springboot.store.repository;

import com.springboot.store.entity.DailyShift;
import com.springboot.store.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShiftRepository extends JpaRepository<Shift, Integer> {
    List<Shift> findByStoreId(Integer storeId);

    List<Shift> findByDailyShiftsContains(DailyShift dailyShift);

}
