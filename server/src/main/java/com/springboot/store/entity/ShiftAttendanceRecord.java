package com.springboot.store.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

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

    @Column(name = "time_in")
    private Date timeIn;

    @Column(name = "time_out")
    private Date timeOut;

    @Column(name = "note")
    private String note;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
