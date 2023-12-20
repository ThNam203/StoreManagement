package com.springboot.store.payload;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PurchaseReturnDetailDTO {
    private int id;
    private int quantity;
    private int supplyPrice;
    private int returnPrice;
    private int discount;
    private int total;
    private String unit;
    private String note;
    private Integer productId;
}
