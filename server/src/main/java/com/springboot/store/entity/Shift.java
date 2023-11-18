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
@Table(name = "shifts")
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "start_time")
    @JsonFormat(pattern = "HH:mm:ss")
    private Date startTime;

    @Column(name = "end_time")
    @JsonFormat(pattern = "HH:mm:ss")
    private Date endTime;
    
}
