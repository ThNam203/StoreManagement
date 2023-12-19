package com.springboot.store.repository;

import com.springboot.store.entity.PurchaseReturn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PurchaseReturnRepository extends JpaRepository<PurchaseReturn, Integer> {
    List<PurchaseReturn> findByStoreId(int storeId);
}
