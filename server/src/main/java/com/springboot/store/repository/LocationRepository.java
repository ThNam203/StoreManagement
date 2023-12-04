package com.springboot.store.repository;

import com.springboot.store.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Integer> {
    Optional<Location> findByNameAndStoreId(String name, Integer storeId);
    List<Location> findByStoreId(Integer storeId);
}
