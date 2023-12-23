package com.springboot.store.service;

import com.springboot.store.payload.DamagedItemDTO;

import java.util.List;

public interface DamagedItemService {
    List<DamagedItemDTO> getAllDamagedItems();
    DamagedItemDTO getDamagedItemById(int id);
    DamagedItemDTO createDamagedItem(DamagedItemDTO damagedItemDTO);
    DamagedItemDTO updateDamagedItem(int id, DamagedItemDTO damagedItemDTO);
    void deleteDamagedItem(int id);
}
