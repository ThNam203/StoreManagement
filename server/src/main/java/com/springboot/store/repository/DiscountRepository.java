package com.springboot.store.repository;

import com.springboot.store.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiscountRepository extends JpaRepository<Discount, Integer> {
    List<Discount> findByStoreId(Integer storeId);
}
