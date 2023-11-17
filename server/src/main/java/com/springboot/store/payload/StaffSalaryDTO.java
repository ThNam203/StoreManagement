package com.springboot.store.payload;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffSalaryDTO {
    private int id;
    private StaffBaseSalaryDTO staffBaseSalaryDTO;
    private StaffBaseSalaryBonusDTO staffBaseSalaryBonusDTO;
    private StaffOvertimeSalaryBonusDTO staffOvertimeSalaryBonusDTO;
}
