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
    long total = 0;
    long originalPrice = 0;
    long income = 0;
}
