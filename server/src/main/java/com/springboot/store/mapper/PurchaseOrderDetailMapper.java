package com.springboot.store.mapper;

import com.springboot.store.entity.PurchaseOrderDetail;
import com.springboot.store.payload.PurchaseOrderDetailDTO;

public class PurchaseOrderDetailMapper {
    public static PurchaseOrderDetailDTO toPurchaseOrderDetailDTO(PurchaseOrderDetail purchaseOrderDetail) {
        return PurchaseOrderDetailDTO.builder()
                .id(purchaseOrderDetail.getId())
                .quantity(purchaseOrderDetail.getQuantity())
                .price(purchaseOrderDetail.getPrice())
                .discount(purchaseOrderDetail.getDiscount())
                .note(purchaseOrderDetail.getNote())
                .productId(purchaseOrderDetail.getProduct() != null ? purchaseOrderDetail.getProduct().getId() : null)
                .build();
    }
    public static PurchaseOrderDetail toPurchaseOrderDetail(PurchaseOrderDetailDTO purchaseOrderDetailDTO) {
        return PurchaseOrderDetail.builder()
                .quantity(purchaseOrderDetailDTO.getQuantity())
                .price(purchaseOrderDetailDTO.getPrice())
                .discount(purchaseOrderDetailDTO.getDiscount())
                .note(purchaseOrderDetailDTO.getNote())
                .build();
    }
}
