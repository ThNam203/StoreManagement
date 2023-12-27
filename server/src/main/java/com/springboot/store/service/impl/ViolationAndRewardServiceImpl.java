package com.springboot.store.service.impl;

import com.springboot.store.entity.Staff;
import com.springboot.store.entity.ViolationAndReward;
import com.springboot.store.payload.ViolationAndRewardDTO;
import com.springboot.store.repository.ViolationAndRewardRepository;
import com.springboot.store.service.StaffService;
import com.springboot.store.service.ViolationAndRewardService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ViolationAndRewardServiceImpl implements ViolationAndRewardService {
    private final ViolationAndRewardRepository violationAndRewardRepository;
    private final StaffService staffService;
    private final ModelMapper modelMapper;

    @Override
    public List<ViolationAndRewardDTO> getAllViolationAndRewards() {
        Staff staff = staffService.getAuthorizedStaff();
        return violationAndRewardRepository.findByStoreId(staff.getStore().getId()).stream().map(violationAndReward -> modelMapper.map(violationAndReward, ViolationAndRewardDTO.class)).toList();
    }

    @Override
    public ViolationAndRewardDTO createViolationAndReward(ViolationAndRewardDTO violationAndRewardDTO) {
        Staff staff = staffService.getAuthorizedStaff();
        ViolationAndReward violationAndReward = ViolationAndReward.builder()
                .defaultValue(violationAndRewardDTO.getDefaultValue())
                .name(violationAndRewardDTO.getName())
                .type(violationAndRewardDTO.getType())
                .build();
        violationAndReward.setStore(staff.getStore());
        violationAndReward = violationAndRewardRepository.save(violationAndReward);
        return modelMapper.map(violationAndReward, ViolationAndRewardDTO.class);
    }

    @Override
    public ViolationAndRewardDTO updateViolationAndReward(int id, ViolationAndRewardDTO violationAndRewardDTO) {
        ViolationAndReward violationAndReward = violationAndRewardRepository.findById(id).orElseThrow(() -> new RuntimeException("Violation and reward not found with id: " + id));
        violationAndReward.setType(violationAndRewardDTO.getType());
        violationAndReward.setName(violationAndRewardDTO.getName());
        violationAndReward.setDefaultValue(violationAndRewardDTO.getDefaultValue());
        violationAndReward = violationAndRewardRepository.save(violationAndReward);
        return modelMapper.map(violationAndReward, ViolationAndRewardDTO.class);
    }

    @Override
    public void deleteViolationAndReward(int id) {
        violationAndRewardRepository.deleteById(id);
    }
}
