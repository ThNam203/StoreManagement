package com.springboot.store.payload;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PurchaseOrderDetailDTO {
    private int id;
    private int quantity;
    private int price;
    private int discount;
    private String note;
    private Integer productId;
}
