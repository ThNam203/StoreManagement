package com.springboot.store.service;

import com.springboot.store.payload.ViolationAndRewardDTO;

import java.util.List;

public interface ViolationAndRewardService {
    List<ViolationAndRewardDTO> getAllViolationAndRewards();

    ViolationAndRewardDTO createViolationAndReward(ViolationAndRewardDTO violationAndRewardDTO);

    ViolationAndRewardDTO updateViolationAndReward(int id, ViolationAndRewardDTO violationAndRewardDTO);

    void deleteViolationAndReward(int id);
}
