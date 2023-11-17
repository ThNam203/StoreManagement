package com.springboot.store.payload;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffBaseSalaryBonusDTO {
    private int id;
    private StaffDayOffBonusDTO staffDayOffBonusDTO;
    private StaffHolidayBonusDTO staffHolidayBonusDTO;
    private StaffSaturdayBonusDTO staffSaturdayBonusDTO;
    private StaffSundayBonusDTO staffSundayBonusDTO;
}
