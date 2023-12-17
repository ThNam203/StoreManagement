package com.springboot.store.mapper;

import com.springboot.store.entity.StockCheck;
import com.springboot.store.payload.StockCheckDTO;

public class StockCheckMapper {
    public static StockCheckDTO toStockCheckDTO(StockCheck stockCheck) {
        return StockCheckDTO.builder()
                .id(stockCheck.getId())
                .createdDate(stockCheck.getCreatedDate())
                .creatorId(stockCheck.getCreator() == null ? null : stockCheck.getCreator().getId())
                .products(stockCheck.getProducts() == null ? null :
                        stockCheck.getProducts().stream().map(StockCheckDetailMapper::toStockCheckDetailDTO).toList())
                .note(stockCheck.getNote())
                .build();
    }
    public static StockCheck toStockCheck(StockCheckDTO stockCheckDTO) {
        return StockCheck.builder()
                .createdDate(stockCheckDTO.getCreatedDate())
                .note(stockCheckDTO.getNote())
                .build();
    }
}
