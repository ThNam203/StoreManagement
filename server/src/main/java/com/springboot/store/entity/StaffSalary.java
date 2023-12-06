package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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

    @Column(name = "salary", nullable = false)
    private int salary = 0;

    @Column(name = "salary_type", nullable = false)
    private String salaryType;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
