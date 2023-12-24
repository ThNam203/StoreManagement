package com.springboot.store.repository;

import com.springboot.store.entity.ViolationAndReward;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ViolationAndRewardRepository extends JpaRepository<ViolationAndReward, Integer> {
    List<ViolationAndReward> findByStoreId(int storeId);
}
