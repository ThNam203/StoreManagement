package com.springboot.store.repository;

import com.springboot.store.entity.StaffHolidayBonus;
import com.springboot.store.entity.StaffOvertimeSalaryBonus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffOvertimeSalaryBonusRepository extends JpaRepository<StaffOvertimeSalaryBonus, Integer> {
}
