package com.springboot.store.payload;

import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffDayOffBonusDTO {
    private int id;
    private Double value;
    private String bonusUnit;
}
