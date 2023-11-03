package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "product_property")
public class ProductProperty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne()
    @JoinColumn(name = "property_name_id")
    private ProductPropertyName propertyName;

    private String propertyValues;

    @ManyToOne()
    @JoinColumn(name = "product_id")
    private Product product;
}
