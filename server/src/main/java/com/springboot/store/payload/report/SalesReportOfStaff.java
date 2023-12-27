package com.springboot.store.payload.report;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SalesReportOfStaff {
    private Integer staffId;
    private String staffName;
    private double revenueMoney;
    private double returnMoney;
}
