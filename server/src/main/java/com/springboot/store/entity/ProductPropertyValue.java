package com.springboot.store.entity;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "product_property_value")
public class ProductPropertyValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String value;

    @ManyToOne()
    @JoinColumn(name = "property_id")
    private ProductProperty property;
}
