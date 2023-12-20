package com.springboot.store.repository;

import com.springboot.store.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    List<Supplier> findByStoreId(int storeId);
    Optional<Supplier> findByEmail(String email);
}
