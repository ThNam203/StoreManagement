package com.springboot.store.service;

import com.springboot.store.payload.StoreDTO;

public interface StoreService {
    StoreDTO getStore();

    StoreDTO updateStore(StoreDTO storeDTO);
}
