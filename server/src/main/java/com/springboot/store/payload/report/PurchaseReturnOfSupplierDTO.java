package com.springboot.store.payload.report;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PurchaseReturnOfSupplierDTO {
    int id;
    Date date;
    String staffName;
    double total;
    double discount;
    double totalPay;
}
