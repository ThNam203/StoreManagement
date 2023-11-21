package com.springboot.store.mapper;

import com.springboot.store.entity.InvoiceDetail;
import com.springboot.store.payload.InvoiceDetailDTO;

public class InvoiceDetailMapper {
    public static InvoiceDetailDTO toInvoiceDetailDTO(InvoiceDetail invoiceDetail) {
        return InvoiceDetailDTO.builder()
                .id(invoiceDetail.getId())
                .quantity(invoiceDetail.getQuantity())
                .price(invoiceDetail.getPrice())
                .description(invoiceDetail.getDescription())
                .productId(invoiceDetail.getProductId())
                .build();
    }

    public static InvoiceDetail toInvoiceDetail(InvoiceDetailDTO invoiceDetailDTO) {
        return InvoiceDetail.builder()
                .quantity(invoiceDetailDTO.getQuantity())
                .price(invoiceDetailDTO.getPrice())
                .description(invoiceDetailDTO.getDescription())
                .productId(invoiceDetailDTO.getProductId())
                .build();
    }
}
