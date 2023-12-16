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
@Table(name = "shifts")
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "status")
    private String status;

    @OneToOne(cascade = CascadeType.ALL)
    private ShiftWorkingTime workingTime;

    @OneToOne(cascade = CascadeType.ALL)
    private ShiftClickingTime clickingTime;

    @OneToMany(cascade = CascadeType.ALL)
    private List<DailyShift> dailyShifts;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;

}
