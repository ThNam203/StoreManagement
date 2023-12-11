package com.springboot.store.payload;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReturnDetailDTO {
    private int id;
    private int quantity;
    private int price;
    private String description;
    private int productId;
}
