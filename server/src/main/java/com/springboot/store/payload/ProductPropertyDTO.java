package com.springboot.store.payload;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductPropertyDTO {
    private int id;
    private ProductPropertyNameDTO propertyName;
    private String propertyValue;
    private ProductDTO product;

    private int productId;
    private int productPropertyNameId;
}
