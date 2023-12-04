package com.springboot.store.entity;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "sales_units")
public class SalesUnits {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int id;
    private String basicUnit;
    private String name;
    private double exchangeValue;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
