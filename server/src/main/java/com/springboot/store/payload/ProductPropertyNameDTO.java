package com.springboot.store.payload;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductPropertyNameDTO {
    private int id;
    private String name;
}
