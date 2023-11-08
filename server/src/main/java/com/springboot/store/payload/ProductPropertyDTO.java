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
    private String propertyName;
    private String propertyValue;
}
