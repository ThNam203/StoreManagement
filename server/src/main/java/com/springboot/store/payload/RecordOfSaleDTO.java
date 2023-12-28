package com.springboot.store.payload;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecordOfSaleDTO {
    Date date;
    double total = 0;
    double originalPrice = 0;
    double income = 0;
}
