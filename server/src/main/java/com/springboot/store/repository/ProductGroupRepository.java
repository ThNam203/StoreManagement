package com.springboot.store.repository;

import com.springboot.store.entity.ProductGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductGroupRepository extends JpaRepository<ProductGroup, Integer> {
    Optional<ProductGroup> findByName(String name);
}
