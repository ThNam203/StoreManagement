package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "locations")
public class Location {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int id;
    private String name;

    @OneToMany(mappedBy = "location")
    private List<Product> products;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
