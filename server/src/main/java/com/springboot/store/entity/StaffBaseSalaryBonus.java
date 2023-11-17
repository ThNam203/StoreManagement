package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "staff_base_salary_bonus")
public class StaffBaseSalaryBonus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne(cascade = CascadeType.ALL)
    private StaffSaturdayBonus staffSaturdayBonus;

    @OneToOne(cascade = CascadeType.ALL)
    private StaffSundayBonus staffSundayBonus;

    @OneToOne(cascade = CascadeType.ALL)
    private StaffDayOffBonus staffDayOffBonus;

    @OneToOne(cascade = CascadeType.ALL)
    private StaffHolidayBonus staffHolidayBonus;
}
