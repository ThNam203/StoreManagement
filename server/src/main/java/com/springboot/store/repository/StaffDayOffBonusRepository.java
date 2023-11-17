package com.springboot.store.repository;

import com.springboot.store.entity.StaffDayOffBonus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffDayOffRepository extends JpaRepository<StaffDayOffBonus, Integer> {
}
