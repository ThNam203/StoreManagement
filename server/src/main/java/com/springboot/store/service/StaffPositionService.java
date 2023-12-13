package com.springboot.store.service;

import com.springboot.store.payload.StaffPositionDTO;

import java.util.List;

public interface StaffPositionService {
    List<StaffPositionDTO> getAllStaffPositions();

    StaffPositionDTO createStaffPosition(StaffPositionDTO staffPositionDTO);

    StaffPositionDTO updateStaffPosition(int staffPositionId, StaffPositionDTO staffPositionDTO);

    void deleteStaffPosition(int staffPositionId);
}
