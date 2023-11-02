package com.springboot.store.payload;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductPriceDTO {
    private int id;
    private double price;
    private String name;
    private String note;
    private SalesUnitsDTO unit;
    private ProductDTO product;
}
