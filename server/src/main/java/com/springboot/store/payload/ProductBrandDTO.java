package com.springboot.store.payload;

import lombok.*;

import java.util.Set;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductBrandDTO {
    private int id;
    private String name;

    private Set<ProductDTO> products;
}
