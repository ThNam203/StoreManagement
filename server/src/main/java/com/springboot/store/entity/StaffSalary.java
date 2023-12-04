package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "staff_salary")
public class StaffSalary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @OneToOne(cascade = CascadeType.ALL)
    private StaffBaseSalary staffBaseSalary;

    @OneToOne(cascade = CascadeType.ALL)
    private StaffBaseSalaryBonus staffBaseSalaryBonus;

    @OneToOne(cascade = CascadeType.ALL)
    private StaffOvertimeSalaryBonus staffOvertimeSalaryBonus;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
