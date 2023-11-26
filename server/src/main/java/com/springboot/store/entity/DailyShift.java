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

    @Column(name = "shift_id")
    private int shiftId;

    @Column(name = "shift_name")
    private String shiftName;

    @Column(name = "date")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date date;

    @Column(name = "note")
    private String note;

    @OneToMany(cascade = CascadeType.ALL)
    private List<ShiftAttendanceRecord> attendanceList;
}
