package com.springboot.store.mapper;

import com.springboot.store.entity.ReturnDetail;
import com.springboot.store.payload.ReturnDetailDTO;

public class ReturnDetailMapper {
    public static ReturnDetailDTO toReturnDetailDTO(ReturnDetail returnDetail) {
        return ReturnDetailDTO.builder()
                .id(returnDetail.getId())
                .quantity(returnDetail.getQuantity())
                .price(returnDetail.getPrice())
                .description(returnDetail.getDescription())
                .productId(returnDetail.getProduct() != null ? returnDetail.getProduct().getId() : 0)
                .build();
    }
    public static ReturnDetail toReturnDetail(ReturnDetailDTO returnDetailDTO) {
        return ReturnDetail.builder()
                .quantity(returnDetailDTO.getQuantity())
                .price(returnDetailDTO.getPrice())
                .description(returnDetailDTO.getDescription())
                .build();
    }
}
