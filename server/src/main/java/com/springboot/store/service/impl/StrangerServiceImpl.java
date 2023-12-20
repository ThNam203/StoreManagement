package com.springboot.store.service.impl;

import com.springboot.store.entity.Staff;
import com.springboot.store.entity.Store;
import com.springboot.store.entity.Stranger;
import com.springboot.store.payload.StrangerDTO;
import com.springboot.store.repository.StrangerRepository;
import com.springboot.store.service.StaffService;
import com.springboot.store.service.StrangerService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StrangerServiceImpl implements StrangerService {
    private final StrangerRepository strangerRepository;
    private final ModelMapper modelMapper;
    private final StaffService staffService;

    @Override
    public List<StrangerDTO> getAllStrangers() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<Stranger> strangers = strangerRepository.findByStoreId(storeId);
        return strangers.stream().map(stranger -> modelMapper.map(stranger, StrangerDTO.class)).toList();
    }

    @Override
    public StrangerDTO getStrangerById(int id) {
        Stranger stranger = strangerRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Stranger not found with id: " + id));
        return modelMapper.map(stranger, StrangerDTO.class);
    }

    @Override
    public StrangerDTO createStranger(StrangerDTO strangerDTO) {
        Store store = staffService.getAuthorizedStaff().getStore();
        Stranger stranger = modelMapper.map(strangerDTO, Stranger.class);
        if (strangerRepository.existsByPhoneNumberAndStore(stranger.getPhoneNumber(), store)) {
            throw new EntityNotFoundException("Stranger already exists with phone: " + stranger.getPhoneNumber());
        }
        stranger.setStore(store);
        stranger = strangerRepository.save(stranger);
        return modelMapper.map(stranger, StrangerDTO.class);
    }

    @Override
    public StrangerDTO updateStranger(int id, StrangerDTO strangerDTO) {
        Stranger stranger = strangerRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Stranger not found with id: " + id));
        stranger.setNote(strangerDTO.getNote());
        stranger.setAddress(strangerDTO.getAddress());
        if (!strangerDTO.getPhoneNumber().equals(stranger.getPhoneNumber()) && strangerRepository.existsByPhoneNumberAndStore(strangerDTO.getPhoneNumber(), stranger.getStore())) {
            throw new EntityNotFoundException("Stranger already exists with phone: " + strangerDTO.getPhoneNumber());
        }
        stranger.setPhoneNumber(strangerDTO.getPhoneNumber());
        stranger.setName(strangerDTO.getName());
        stranger = strangerRepository.save(stranger);
        return modelMapper.map(stranger, StrangerDTO.class);
    }

    @Override
    public void deleteStranger(int id) {
        strangerRepository.deleteById(id);
    }
}
