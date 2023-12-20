package com.springboot.store.service.impl;

import com.springboot.store.entity.StaffPosition;
import com.springboot.store.entity.Store;
import com.springboot.store.payload.StaffPositionDTO;
import com.springboot.store.repository.StaffPositionRepository;
import com.springboot.store.repository.StaffRepository;
import com.springboot.store.repository.StoreRepository;
import com.springboot.store.service.StaffPositionService;
import com.springboot.store.service.StaffService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffPositionServiceImpl implements StaffPositionService {
    private final StaffPositionRepository staffPositionRepository;
    private final ModelMapper modelMapper;
    private final StaffService staffService;
    private final StaffRepository staffRepository;

    @Override
    public List<StaffPositionDTO> getAllStaffPositions() {
        int id = staffService.getAuthorizedStaff().getStore().getId();
        List<StaffPosition> staffPositions = staffPositionRepository.findByStoreId(id);
        return staffPositions.stream().map(staffPosition -> modelMapper.map(staffPosition, StaffPositionDTO.class)).toList();
    }

    @Override
    public StaffPositionDTO createStaffPosition(StaffPositionDTO staffPositionDTO) {
        if (staffPositionRepository.existsByNameAndStore(staffPositionDTO.getName(), staffService.getAuthorizedStaff().getStore())) {
            throw new RuntimeException("Staff position already exists");
        }
        StaffPosition staffPosition = modelMapper.map(staffPositionDTO, StaffPosition.class);
        staffPosition.setStore(staffService.getAuthorizedStaff().getStore());
        staffPosition = staffPositionRepository.save(staffPosition);
        return modelMapper.map(staffPosition, StaffPositionDTO.class);
    }

    @Override
    public StaffPositionDTO updateStaffPosition(int staffPositionId, StaffPositionDTO staffPositionDTO) {
        StaffPosition existingStaffPosition = staffPositionRepository.findById(staffPositionId).orElseThrow();
        existingStaffPosition.setName(staffPositionDTO.getName());
        existingStaffPosition = staffPositionRepository.save(existingStaffPosition);
        return modelMapper.map(existingStaffPosition, StaffPositionDTO.class);
    }

    @Override
    public void deleteStaffPosition(int staffPositionId) {
        StaffPosition existingStaffPosition = staffPositionRepository.findById(staffPositionId).orElseThrow();
        if (staffRepository.existsByStaffPosition(existingStaffPosition)) {
            throw new RuntimeException("Cannot delete staff position that is being used by staff");
        }
        staffPositionRepository.deleteById(staffPositionId);
    }
}
