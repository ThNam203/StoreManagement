package com.springboot.store.payload.report;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecordOfSupplierDTO {
    int supplierId;
    String name;
    double totalOfProduct = 0;
    double discount = 0;
    double totalPay = 0;
    double totalReturn = 0;
    List<PurchaseOrderOfSupplierDTO> purchaseOrders;
    List<PurchaseReturnOfSupplierDTO> purchaseReturns;
}
