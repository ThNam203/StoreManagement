package com.springboot.store.repository;

import com.springboot.store.entity.RoleSetting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoleSettingRepository extends JpaRepository<RoleSetting, Integer> {
    Optional<RoleSetting> findByStaffPositionId(int staffPositionId);
    List<RoleSetting> findByStoreId(int storeId);
}
