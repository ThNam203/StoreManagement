package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "staff_base_salary")
public class StaffBaseSalary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "value", nullable = false)
    private int value = 0;

    @Column(name = "salary_type", nullable = false)
    private String salaryType;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
