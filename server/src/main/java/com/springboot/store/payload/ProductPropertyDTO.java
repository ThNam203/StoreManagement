package com.springboot.store.payload;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductPropertyDTO {
    private int id;
    private String name;
    private String value;
}
