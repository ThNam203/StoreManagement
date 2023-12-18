package com.springboot.store.repository;

import com.springboot.store.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    List<Customer> findByStoreId(Integer storeId);
    List<Customer> findByEmail(String email);
}
