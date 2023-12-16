package com.springboot.store.repository;

import com.springboot.store.entity.SupplierGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierGroupRepository extends JpaRepository<SupplierGroup, Integer> {
    Optional<SupplierGroup> findByNameAndStoreId(String name, int storeId);
    List<SupplierGroup> findByStoreId(int storeId);
}
