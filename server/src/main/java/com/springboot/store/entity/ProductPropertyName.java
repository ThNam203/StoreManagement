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
@Table(name = "product_property_name")
public class ProductPropertyName {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;

    @OneToMany(mappedBy = "propertyName", cascade = CascadeType.ALL)
    private Set<ProductProperty> productProperties;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
