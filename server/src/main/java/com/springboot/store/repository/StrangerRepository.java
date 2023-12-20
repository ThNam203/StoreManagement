package com.springboot.store.repository;

import com.springboot.store.entity.Store;
import com.springboot.store.entity.Stranger;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StrangerRepository extends JpaRepository<Stranger, Integer> {
    List<Stranger> findByStoreId(int storeId);

    Boolean existsByPhoneNumberAndStore(String phone, Store store);
}
