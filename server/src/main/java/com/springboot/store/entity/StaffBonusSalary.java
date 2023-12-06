package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "staff_bonus_salary")
public class StaffBonusSalary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "value", nullable = false)
    private int value = 0;
    @Column(name = "name")
    private String name;
    @Column(name = "multiply")
    private int multiply;
    @ManyToOne()
    @JoinColumn(name = "shift_attendance_record_id")
    private ShiftAttendanceRecord shiftAttendanceRecord;
    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
