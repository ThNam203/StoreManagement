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
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "barcode", nullable = false, unique = true)
    private String barcode;

    @Column(name = "property")
    private String property;

    @Column(name = "original_price")
    private int originalPrice;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "status")
    private String status;

    @Column(name = "description")
    private String description;

    @Column(name = "note")
    private String note;

    @Column(name = "min_stock")
    private int minStock;

    @Column(name = "max_stock")
    private int maxStock;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductPrice> productPrices;

    @ManyToOne()
    @JoinColumn(name = "product_group_id")
    private ProductGroup productGroup;

    @ManyToOne()
    @JoinColumn(name = "product_brand_id")
    private ProductBrand productBrand;

    @OneToMany(cascade = CascadeType.ALL)
    private Set<ProductProperty> properties;

    @OneToMany(cascade = CascadeType.ALL)
    private Set<Media> images;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "location_id")
    private Location location;

}
