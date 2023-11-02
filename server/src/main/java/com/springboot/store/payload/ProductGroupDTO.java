package com.springboot.store.payload;

import lombok.*;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductGroupDTO {
    private int id;
    private String name;
    private String description;
    private Date createdAt;
    private Set<ProductDTO> products;
}
