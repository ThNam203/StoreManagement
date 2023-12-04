package com.springboot.store.repository;

import com.springboot.store.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    List<Customer> findByStoreId(Integer storeId);
}
