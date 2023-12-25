package com.springboot.store.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "shift_attendance_records")
public class ShiftAttendanceRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "staff_id")
    private int staffId;

    @Column(name = "has_attend")
    private boolean hasAttend;

    @Column(name = "date")
    private Date date;

    @Column(name = "note")
    private String note;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<StaffBonusSalary> bonusSalaryList;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<StaffPunishSalary> punishSalaryList;

    @ManyToOne()
    @JoinColumn(name = "daily_shift_id")
    private DailyShift dailyShift;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
