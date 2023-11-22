package com.springboot.store.repository;

import com.springboot.store.entity.DiscountCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DiscountCodeRepository extends JpaRepository<DiscountCode, Integer> {
    Boolean existsByCode(String code);
    Optional<DiscountCode> findByCode(String code);
}
