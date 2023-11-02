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

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductPropertyValue> propertyValues;

    @ManyToOne()
    @JoinColumn(name = "product_id")
    private Product product;
}
