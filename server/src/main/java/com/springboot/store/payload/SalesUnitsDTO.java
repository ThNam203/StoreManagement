package com.springboot.store.payload;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SalesUnitsDTO {
    private int id;
    private String basicUnit;
    private String name;
    private double exchangeValue;
}
