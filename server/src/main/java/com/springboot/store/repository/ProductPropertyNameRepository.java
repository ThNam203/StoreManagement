package com.springboot.store.repository;

import com.springboot.store.entity.ProductPropertyName;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductPropertyNameRepository extends JpaRepository<ProductPropertyName, Integer> {
}
