package com.springboot.store.payload.report;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FinancialReport {
    private double salesRevenue;
    private double adjustmentDiscount;
    private double adjustmentReturn;
    private double netRevenue;
    private double costOfGoodsSold;
    private double grossProfit;
    private double salaryStaff;
    private double bonusStaff;
    private double penaltyStaff;
    private double netProfit;
}
