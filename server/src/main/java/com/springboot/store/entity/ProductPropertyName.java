package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "product_property_name", uniqueConstraints =
        @UniqueConstraint(name = "product_property_name_name_unique", columnNames = {"name"})
)
public class ProductPropertyName {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
}
