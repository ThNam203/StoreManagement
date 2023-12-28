package com.springboot.store.payload.report;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SalesReportOfCustomer {
    private Integer customerId;
    private String customerName;
    private double subTotal;
    private double discountValue;
    private double revenue;
    private double returnRevenue;
    private double netRevenue;
}
