package com.springboot.store.service.impl;

import com.springboot.store.entity.ShiftClickingTime;
import com.springboot.store.payload.ShiftClickingTimeDTO;
import com.springboot.store.repository.ShiftClickingTimeRepository;
import com.springboot.store.service.ShiftClickingTimeService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShiftClickingTimeServiceImpl implements ShiftClickingTimeService {
    private final ShiftClickingTimeRepository shiftClickingTimeRepository;
    private final ModelMapper modelMapper;

    @Override
    public ShiftClickingTimeDTO getShiftClickingTime(int shiftId) {
        ShiftClickingTime shiftClickingTime = shiftClickingTimeRepository.findById(shiftId).orElseThrow(() -> new EntityNotFoundException("ShiftClickingTime not found with id: " + shiftId));
        return modelMapper.map(shiftClickingTime, ShiftClickingTimeDTO.class);
    }

    @Override
    public ShiftClickingTimeDTO updateShiftClickingTime(int shiftId, ShiftClickingTimeDTO shiftClickingTimeDTO) {
        ShiftClickingTime existingShiftClickingTime = shiftClickingTimeRepository.findById(shiftId).orElseThrow(() -> new EntityNotFoundException("ShiftClickingTime not found with id: " + shiftId));
        existingShiftClickingTime.setStartTime(shiftClickingTimeDTO.getStartTime());
        existingShiftClickingTime.setEndTime(shiftClickingTimeDTO.getEndTime());
        existingShiftClickingTime = shiftClickingTimeRepository.save(existingShiftClickingTime);
        return modelMapper.map(existingShiftClickingTime, ShiftClickingTimeDTO.class);
    }

    @Override
    public ShiftClickingTimeDTO createShiftClickingTime(ShiftClickingTimeDTO shiftClickingTimeDTO) {
        ShiftClickingTime shiftClickingTime = modelMapper.map(shiftClickingTimeDTO, ShiftClickingTime.class);
        shiftClickingTime = shiftClickingTimeRepository.save(shiftClickingTime);
        return modelMapper.map(shiftClickingTime, ShiftClickingTimeDTO.class);
    }

    @Override
    public void deleteShiftClickingTime(int shiftId) {
        shiftClickingTimeRepository.deleteById(shiftId);
    }
}
