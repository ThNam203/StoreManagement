package com.springboot.store.payload;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffSaturdayBonusDTO {
    private int id;
    private double value;
    private String bonusUnit;
}
