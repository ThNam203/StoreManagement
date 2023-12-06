package com.springboot.store.repository;

import com.springboot.store.entity.StaffBonusSalary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffBonusSalaryRepository extends JpaRepository<StaffBonusSalary, Integer> {
    
}
