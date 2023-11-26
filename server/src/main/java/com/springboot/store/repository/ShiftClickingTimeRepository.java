package com.springboot.store.repository;

import com.springboot.store.entity.ShiftClickingTime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShiftClickingTimeRepository extends JpaRepository<ShiftClickingTime, Integer> {
}
