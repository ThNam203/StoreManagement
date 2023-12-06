package com.springboot.store.service;

import com.springboot.store.payload.StockCheckDTO;

import java.util.List;

public interface StockCheckService {
    List<StockCheckDTO> getAllStockChecks();
    StockCheckDTO getStockCheckById(int id);
    StockCheckDTO createStockCheck(StockCheckDTO stockCheckDTO);
    StockCheckDTO updateStockCheck(int id, StockCheckDTO stockCheckDTO);
    void deleteStockCheck(int id);
}
