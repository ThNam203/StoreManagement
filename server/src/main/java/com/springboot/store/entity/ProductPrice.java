package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "product_prices")
public class ProductPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private double price;
    private String name;
    private String note;

    @ManyToOne()
    @JoinColumn(name = "unit_id")
    private SalesUnits unit;

    @ManyToOne()
    @JoinColumn(name = "product_id")
    private Product product;
}
