package com.springboot.store.payload;

import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceDetailDTO {
    private int id;
    private int quantity;
    private double price;
    private double discount;
    private String description;
    private int productId;
}
