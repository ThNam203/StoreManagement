package com.springboot.store.repository;

import com.springboot.store.entity.DamagedItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DamagedItemRepository extends JpaRepository<DamagedItem, Integer> {
    List<DamagedItem> findByStoreId(int storeId);
}
