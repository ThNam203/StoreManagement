package com.springboot.store.service.impl;

import com.springboot.store.entity.ShiftWorkingTime;
import com.springboot.store.payload.ShiftWorkingTimeDTO;
import com.springboot.store.repository.ShiftWorkingTimeRepository;
import com.springboot.store.service.ShiftWorkingTimeService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShiftWorkingTimeServiceImpl implements ShiftWorkingTimeService {
    private final ShiftWorkingTimeRepository shiftWorkingTimeRepository;
    private final ModelMapper modelMapper;

    @Override
    public ShiftWorkingTimeDTO getShiftWorkingTime(int shiftId) {
        ShiftWorkingTime shiftWorkingTime = shiftWorkingTimeRepository.findById(shiftId).orElseThrow(() -> new EntityNotFoundException("ShiftWorkingTime not found with id: " + shiftId));
        return modelMapper.map(shiftWorkingTime, ShiftWorkingTimeDTO.class);
    }

    @Override
    public ShiftWorkingTimeDTO updateShiftWorkingTime(int shiftId, ShiftWorkingTimeDTO shiftWorkingTimeDTO) {
        ShiftWorkingTime existingShiftWorkingTime = shiftWorkingTimeRepository.findById(shiftId).orElseThrow(() -> new EntityNotFoundException("ShiftWorkingTime not found with id: " + shiftId));
        existingShiftWorkingTime.setStartTime(shiftWorkingTimeDTO.getStartTime());
        existingShiftWorkingTime.setEndTime(shiftWorkingTimeDTO.getEndTime());
        existingShiftWorkingTime = shiftWorkingTimeRepository.save(existingShiftWorkingTime);
        return modelMapper.map(existingShiftWorkingTime, ShiftWorkingTimeDTO.class);
    }

    @Override
    public ShiftWorkingTimeDTO createShiftWorkingTime(ShiftWorkingTimeDTO shiftWorkingTimeDTO) {
        ShiftWorkingTime shiftWorkingTime = modelMapper.map(shiftWorkingTimeDTO, ShiftWorkingTime.class);
        shiftWorkingTime = shiftWorkingTimeRepository.save(shiftWorkingTime);
        return modelMapper.map(shiftWorkingTime, ShiftWorkingTimeDTO.class);
    }

    @Override
    public void deleteShiftWorkingTime(int shiftId) {
        shiftWorkingTimeRepository.deleteById(shiftId);
    }
}
