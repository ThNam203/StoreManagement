package com.springboot.store.payload;

import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffBonusSalaryDTO {
    private int id;
    private int value;
    private String name;
    private int multiply;
}
