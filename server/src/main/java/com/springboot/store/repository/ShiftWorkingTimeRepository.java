package com.springboot.store.repository;

import com.springboot.store.entity.ShiftWorkingTime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShiftWorkingTimeRepository extends JpaRepository<ShiftWorkingTime, Integer> {
}
