package com.springboot.store.mapper;

import com.springboot.store.entity.PurchaseReturnDetail;
import com.springboot.store.payload.PurchaseReturnDetailDTO;

public class PurchaseReturnDetailMapper {
    public static PurchaseReturnDetail toPurchaseReturnDetail(PurchaseReturnDetailDTO purchaseReturnDetailDTO) {
        return PurchaseReturnDetail.builder()
                .quantity(purchaseReturnDetailDTO.getQuantity())
                .supplyPrice(purchaseReturnDetailDTO.getSupplyPrice())
                .returnPrice(purchaseReturnDetailDTO.getReturnPrice())
                .discount(purchaseReturnDetailDTO.getDiscount())
                .total(purchaseReturnDetailDTO.getTotal())
                .unit(purchaseReturnDetailDTO.getUnit())
                .note(purchaseReturnDetailDTO.getNote())
                .build();
    }
    public static PurchaseReturnDetailDTO toPurchaseReturnDetailDTO(PurchaseReturnDetail purchaseReturnDetail) {
        return PurchaseReturnDetailDTO.builder()
                .id(purchaseReturnDetail.getId())
                .quantity(purchaseReturnDetail.getQuantity())
                .supplyPrice(purchaseReturnDetail.getSupplyPrice())
                .returnPrice(purchaseReturnDetail.getReturnPrice())
                .discount(purchaseReturnDetail.getDiscount())
                .total(purchaseReturnDetail.getTotal())
                .unit(purchaseReturnDetail.getUnit())
                .note(purchaseReturnDetail.getNote())
                .productId(purchaseReturnDetail.getProduct() == null ? null : purchaseReturnDetail.getProduct().getId())
                .build();
    }
}
