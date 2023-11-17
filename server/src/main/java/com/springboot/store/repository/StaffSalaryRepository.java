package com.springboot.store.repository;

import com.springboot.store.entity.StaffSalary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffSalaryRepository extends JpaRepository<StaffSalary, Integer> {
}
