package com.springboot.store.repository;

import com.springboot.store.entity.StaffRole;
import com.springboot.store.utils.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffRoleRepository extends JpaRepository<StaffRole, Integer> {
    Optional<StaffRole> findByName(Role name);
    boolean existsByName(Role name);
}
