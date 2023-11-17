package com.springboot.store.repository;

import com.springboot.store.entity.StaffHolidayBonus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffHolidayRepository extends JpaRepository<StaffHolidayBonus, Integer> {
}
