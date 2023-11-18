package com.springboot.store.repository;

import com.springboot.store.entity.StaffBaseSalary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffBaseSalaryRepository extends JpaRepository<StaffBaseSalary, Integer> {
}
