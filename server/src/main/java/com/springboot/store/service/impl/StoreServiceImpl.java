package com.springboot.store.service.impl;

import com.springboot.store.entity.Store;
import com.springboot.store.payload.StoreDTO;
import com.springboot.store.repository.StoreRepository;
import com.springboot.store.service.StaffService;
import com.springboot.store.service.StoreService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService {
    private final StoreRepository storeRepository;
    private final ModelMapper modelMapper;
    private final StaffService staffService;

    @Override
    public StoreDTO getStore() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new EntityNotFoundException("Store not found with id: " + storeId));
        StoreDTO storeDTO = modelMapper.map(store, StoreDTO.class);
        storeDTO.setOwnerID(store.getOwner().getId());
        return storeDTO;
    }

    @Override
    public StoreDTO updateStore(StoreDTO storeDTO) {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        Store existingStore = storeRepository.findById(storeId).orElseThrow(() -> new EntityNotFoundException("Store not found with id: " + storeId));
        existingStore.setName(storeDTO.getName());
        existingStore.setAddress(storeDTO.getAddress());
        existingStore.setPhoneNumber(storeDTO.getPhoneNumber());
        existingStore.setEmail(storeDTO.getEmail());
        existingStore.setDescription(storeDTO.getDescription());
        existingStore.setOwner(staffService.getAuthorizedStaff());
        storeRepository.save(existingStore);
        return modelMapper.map(existingStore, StoreDTO.class);
    }
}
