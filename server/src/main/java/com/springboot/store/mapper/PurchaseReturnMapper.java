package com.springboot.store.mapper;

import com.springboot.store.entity.PurchaseReturn;
import com.springboot.store.payload.PurchaseReturnDTO;

public class PurchaseReturnMapper {
    public static PurchaseReturn toPurchaseReturn(PurchaseReturnDTO purchaseReturnDTO) {
        return PurchaseReturn.builder()
                .subtotal(purchaseReturnDTO.getSubtotal())
                .discount(purchaseReturnDTO.getDiscount())
                .total(purchaseReturnDTO.getTotal())
                .note(purchaseReturnDTO.getNote())
                .createdDate(purchaseReturnDTO.getCreatedDate())
                .build();
    }
    public static PurchaseReturnDTO toPurchaseReturnDTO(PurchaseReturn purchaseReturn) {
        return PurchaseReturnDTO.builder()
                .id(purchaseReturn.getId())
                .subtotal(purchaseReturn.getSubtotal())
                .discount(purchaseReturn.getDiscount())
                .total(purchaseReturn.getTotal())
                .note(purchaseReturn.getNote())
                .createdDate(purchaseReturn.getCreatedDate())
                .purchaseOrderId(purchaseReturn.getPurchaseOrder() == null ? null : purchaseReturn.getPurchaseOrder().getId())
                .staffId(purchaseReturn.getStaff() == null ? null : purchaseReturn.getStaff().getId())
                .supplierId(purchaseReturn.getSupplier() == null ? null : purchaseReturn.getSupplier().getId())
                .purchaseReturnDetails(purchaseReturn.getPurchaseReturnDetails() == null ? null :
                        purchaseReturn.getPurchaseReturnDetails()
                        .stream()
                        .map(PurchaseReturnDetailMapper::toPurchaseReturnDetailDTO)
                        .toList())
                .build();
    }
}
