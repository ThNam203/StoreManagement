package com.springboot.store.repository;

import com.springboot.store.entity.ViolationAndReward;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViolationAndRewardRepository extends JpaRepository<ViolationAndReward, Integer> {
}
