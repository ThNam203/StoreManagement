package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "staff_holiday_bonus")
public class StaffHolidayBonus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "value", nullable = false)
    private Double value = 0.0;

    @Column(name = "bonus_unit", nullable = false)
    private String bonusUnit;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
