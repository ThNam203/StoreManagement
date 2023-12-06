package com.springboot.store.mapper;

import com.springboot.store.entity.StockCheckDetail;
import com.springboot.store.payload.StockCheckDetailDTO;

public class StockCheckDetailMapper {
    public static StockCheckDetailDTO toStockCheckDetailDTO(StockCheckDetail stockCheckDetail) {
        return StockCheckDetailDTO.builder()
                .id(stockCheckDetail.getId())
                .productId(stockCheckDetail.getProduct() == null ? 0 : stockCheckDetail.getProduct().getId())
                .productName(stockCheckDetail.getProductName())
                .productProperties(stockCheckDetail.getProductProperties())
                .countedStock(stockCheckDetail.getCountedStock())
                .realStock(stockCheckDetail.getRealStock())
                .price(stockCheckDetail.getPrice())
                .build();
    }
    public static StockCheckDetail toStockCheckDetail(StockCheckDetailDTO stockCheckDetailDTO) {
        return StockCheckDetail.builder()
                .productName(stockCheckDetailDTO.getProductName())
                .productProperties(stockCheckDetailDTO.getProductProperties())
                .countedStock(stockCheckDetailDTO.getCountedStock())
                .realStock(stockCheckDetailDTO.getRealStock())
                .price(stockCheckDetailDTO.getPrice())
                .build();
    }
}
