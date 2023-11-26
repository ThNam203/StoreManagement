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

    @Column(name = "staff_name")
    private String staffName;

    @Column(name = "has_attend")
    private boolean hasAttend;

    @Column(name = "date")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date date;

    @Column(name = "time_in")
    @JsonFormat(pattern = "HH:mm:ss")
    private Date timeIn;

    @Column(name = "time_out")
    @JsonFormat(pattern = "HH:mm:ss")
    private Date timeOut;

    @Column(name = "note")
    private String note;
}
