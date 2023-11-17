package com.springboot.store.payload;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffDayOffBonusDTO {
    private int id;
    private double value;
    private String bonusUnit;
}
