package com.springboot.store.repository;

import com.springboot.store.entity.StaffOvertimeSalaryBonus;
import com.springboot.store.entity.StaffSaturdayBonus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffSaturdayBonusRepository extends JpaRepository<StaffSaturdayBonus, Integer> {
}
