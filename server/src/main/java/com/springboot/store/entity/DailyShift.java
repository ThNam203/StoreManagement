package com.springboot.store.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "daily_shifts")
public class DailyShift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "date")
    private Date date;

    @Column(name = "note")
    private String note;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ShiftAttendanceRecord> attendanceList;

    @ManyToOne()
    @JoinColumn(name = "shift_id")
    private Shift shift;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
