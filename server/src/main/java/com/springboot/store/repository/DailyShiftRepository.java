package com.springboot.store.repository;

import com.springboot.store.entity.DailyShift;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyShiftRepository extends JpaRepository<DailyShift, Integer> {
}
