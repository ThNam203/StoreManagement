package com.springboot.store.repository;

import com.springboot.store.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Integer> {
    List<Staff> findByStoreId(Integer id);

    Optional<Staff> findByEmail(String email);

    Boolean existsByEmail(String email);

    Boolean existsByCccd(String cccd);

    Boolean existsByStaffPosition(String staffPosition);

    Boolean existsByPhoneNumber(String phoneNumber);

    @Query("SELECT s FROM Staff s WHERE s.staffRole.name != 'Owner'")
    List<Staff> findAllStaffsWithRoleNotOwner();

}