package com.springboot.store.mapper;

import com.springboot.store.entity.DamagedItemDetail;
import com.springboot.store.payload.DamagedItemDetailDTO;

public class DamagedItemDetailMapper {
    public static DamagedItemDetailDTO toDamagedItemDetailDTO(DamagedItemDetail damagedItemDetail) {
        return DamagedItemDetailDTO.builder()
                .id(damagedItemDetail.getId())
                .productId(damagedItemDetail.getProduct() == null ? null : damagedItemDetail.getProduct().getId())
                .damagedQuantity(damagedItemDetail.getDamagedQuantity())
                .build();
    }
    public static DamagedItemDetail toDamagedItemDetail(DamagedItemDetailDTO damagedItemDetailDTO) {
        return DamagedItemDetail.builder()
                .damagedQuantity(damagedItemDetailDTO.getDamagedQuantity())
                .build();
    }
}
