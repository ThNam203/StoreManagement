package com.springboot.store.mapper;

import com.springboot.store.entity.Invoice;
import com.springboot.store.payload.InvoiceDTO;

import java.util.stream.Collectors;

public class InvoiceMapper {
    public static InvoiceDTO toInvoiceDTO(Invoice invoice) {
        return InvoiceDTO.builder()
                .id(invoice.getId())
                .cash(invoice.getCash())
                .changed(invoice.getChanged())
                .subTotal(invoice.getSubTotal())
                .total(invoice.getTotal())
                .status(invoice.getStatus())
                .paymentMethod(invoice.getPaymentMethod())
                .createdAt(invoice.getCreatedAt())
                .customerName(invoice.getCustomer() == null ? null : invoice.getCustomer().getName())
                .staffName(invoice.getStaff() == null ? null : invoice.getStaff().getName())
                .invoiceDetails(invoice.getInvoiceDetails() == null ? null
                        : invoice.getInvoiceDetails()
                        .stream()
                        .map(InvoiceDetailMapper::toInvoiceDetailDTO)
                        .collect(Collectors.toSet()))
                .build();
    }

    public static Invoice toInvoice(InvoiceDTO invoiceDTO) {
        return Invoice.builder()
                .cash(invoiceDTO.getCash())
                .changed(invoiceDTO.getChanged())
                .subTotal(invoiceDTO.getSubTotal())
                .total(invoiceDTO.getTotal())
                .status(invoiceDTO.getStatus())
                .paymentMethod(invoiceDTO.getPaymentMethod())
                .createdAt(invoiceDTO.getCreatedAt())
                .build();
    }
}
