package com.springboot.store.repository;

import com.springboot.store.entity.CustomerGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerGroupRepository extends JpaRepository<CustomerGroup, Integer> {
    CustomerGroup findByNameAndStoreId(String name, Integer storeId);
    List<CustomerGroup> findByStoreId(Integer storeId);
}
