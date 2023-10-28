package com.springboot.store.payload;

import lombok.*;

import java.util.Set;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private int id;
    private String name;
    private String barcode;
    private String location;
    private int originalPrice;
    private int sellingPrice;
    private int quantity;
    private String status;
    private String description;
    private String note;
    private int minQuantity;
    private int maxQuantity;
    private Set<String> images;
}
