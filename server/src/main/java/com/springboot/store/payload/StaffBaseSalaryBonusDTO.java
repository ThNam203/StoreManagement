package com.springboot.store.payload;

import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffBaseSalaryBonusDTO {
    private int id;
    private StaffDayOffBonusDTO staffDayOffBonus;
    private StaffHolidayBonusDTO staffHolidayBonus;
    private StaffSaturdayBonusDTO staffSaturdayBonus;
    private StaffSundayBonusDTO staffSundayBonus;
}
