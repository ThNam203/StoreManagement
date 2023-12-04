package com.springboot.store.repository;

import com.springboot.store.entity.ProductBrand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface ProductBrandRepository extends JpaRepository<ProductBrand, Integer> {
    Optional<ProductBrand> findByNameAndStoreId(String name, Integer storeId);
    List<ProductBrand> findByStoreId(Integer storeId);
}
