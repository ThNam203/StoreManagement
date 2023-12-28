package com.springboot.store.payload.report;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductProfit {
    private Integer productId;
    private int totalCustomer;
    private int totalQuantity;
    private double revenue;
    private int totalReturn;
    private double returnRevenue;
    private double netRevenue;
    private double profit;
}
