package com.springboot.store.mapper;

import com.springboot.store.entity.PurchaseOrder;
import com.springboot.store.payload.PurchaseOrderDTO;

public class PurchaseOrderMapper {
    public static PurchaseOrderDTO toPurchaseOrderDTO(PurchaseOrder purchaseOrder) {
        return PurchaseOrderDTO.builder()
                .id(purchaseOrder.getId())
                .subtotal(purchaseOrder.getSubtotal())
                .discount(purchaseOrder.getDiscount())
                .total(purchaseOrder.getTotal())
                .note(purchaseOrder.getNote())
                .paymentMethod(purchaseOrder.getPaymentMethod())
                .createdDate(purchaseOrder.getCreatedDate())
                .staffId(purchaseOrder.getStaff() != null ? purchaseOrder.getStaff().getId() : null)
                .supplierId(purchaseOrder.getSupplier() != null ? purchaseOrder.getSupplier().getId() : null)
                .purchaseOrderDetail(purchaseOrder.getPurchaseOrderDetail() != null ?
                        purchaseOrder.getPurchaseOrderDetail()
                                .stream()
                                .map(PurchaseOrderDetailMapper::toPurchaseOrderDetailDTO)
                                .toList() : null)
                .build();
    }
    public static PurchaseOrder toPurchaseOrder(PurchaseOrderDTO purchaseOrderDTO) {
        return PurchaseOrder.builder()
                .subtotal(purchaseOrderDTO.getSubtotal())
                .discount(purchaseOrderDTO.getDiscount())
                .total(purchaseOrderDTO.getTotal())
                .note(purchaseOrderDTO.getNote())
                .paymentMethod(purchaseOrderDTO.getPaymentMethod())
                .createdDate(purchaseOrderDTO.getCreatedDate())
                .build();
    }
}
