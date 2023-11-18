package com.springboot.store.repository;

import com.springboot.store.entity.ProductPropertyName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductPropertyNameRepository extends JpaRepository<ProductPropertyName, Integer> {
    Optional<ProductPropertyName> findByName(String propertyName);
    boolean existsByName(String propertyName);
}
