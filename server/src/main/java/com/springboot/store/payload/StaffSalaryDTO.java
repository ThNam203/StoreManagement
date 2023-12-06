package com.springboot.store.payload;

import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffSalaryDTO {
    private int id;
    private int salary;
    private String salaryType;
}
