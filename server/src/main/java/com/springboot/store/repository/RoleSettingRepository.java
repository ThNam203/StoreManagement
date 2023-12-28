package com.springboot.store.repository;

import com.springboot.store.entity.RoleSetting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleSettingRepository extends JpaRepository<RoleSetting, Integer> {
    Optional<RoleSetting> findByOwnerId(int ownerId);
}
