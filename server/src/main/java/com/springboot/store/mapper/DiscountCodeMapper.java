package com.springboot.store.mapper;

import com.springboot.store.entity.DiscountCode;
import com.springboot.store.payload.DiscountCodeDTO;

public class DiscountCodeMapper {
    public static DiscountCodeDTO toDiscountCodeDTO(DiscountCode discountCode) {
        return DiscountCodeDTO.builder()
                .id(discountCode.getId())
                .value(discountCode.getValue())
                .issuedDate(discountCode.getIssuedDate())
                .usedDate(discountCode.getUsedDate())
                .status(discountCode.isStatus())
                .build();
    }
    public static DiscountCode toDiscountCode(DiscountCodeDTO discountCodeDTO) {
        return DiscountCode.builder()
                .value(discountCodeDTO.getValue())
                .issuedDate(discountCodeDTO.getIssuedDate())
                .usedDate(discountCodeDTO.getUsedDate())
                .status(discountCodeDTO.isStatus())
                .build();
    }
}
