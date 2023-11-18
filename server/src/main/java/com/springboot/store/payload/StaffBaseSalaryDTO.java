package com.springboot.store.payload;

import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffBaseSalaryDTO {
    private int id;
    private Integer value;
    private String salaryType;
}
