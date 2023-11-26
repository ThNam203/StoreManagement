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
@Table(name = "shift_clicking_times")
public class ShiftClickingTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "start_time")
    @JsonFormat(pattern = "HH:mm:ss")
    private Date startTime;
    @Column(name = "end_time")
    @JsonFormat(pattern = "HH:mm:ss")
    private Date endTime;
}
