package com.springboot.store.repository;

import com.springboot.store.entity.CustomerGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerGroupRepository extends JpaRepository<CustomerGroup, Integer> {
    CustomerGroup findByName(String name);
}
