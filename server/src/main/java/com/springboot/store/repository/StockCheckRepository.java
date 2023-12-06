package com.springboot.store.repository;

import com.springboot.store.entity.StockCheck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockCheckRepository extends JpaRepository<StockCheck, Integer> {
    List<StockCheck> findByStoreId(int storeId);
}
