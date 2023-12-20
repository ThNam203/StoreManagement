package com.springboot.store.service;

import com.springboot.store.payload.StrangerDTO;

import java.util.List;

public interface StrangerService {
    List<StrangerDTO> getAllStrangers();

    StrangerDTO getStrangerById(int id);

    StrangerDTO createStranger(StrangerDTO strangerDTO);

    StrangerDTO updateStranger(int id, StrangerDTO strangerDTO);

    void deleteStranger(int id);
}
