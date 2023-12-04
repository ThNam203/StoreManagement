package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
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

    @Column(name = "barcode", nullable = false)
    private String barcode;

    @Column(name = "stock")
    private int stock;

    @Column(name = "status")
    private String status;

    @Column(name = "description")
    private String description;

    @Column(name = "note")
    private String note;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "min_stock")
    private int minStock;

    @Column(name = "max_stock")
    private int maxStock;

    @OneToMany(cascade = CascadeType.ALL)
    private List<OriginalPrice> originalPrices;

    @OneToMany(cascade = CascadeType.ALL)
    private List<ProductPrice> productPrices;

    @OneToOne(cascade = CascadeType.ALL)
    private SalesUnits salesUnits;

    @ManyToOne()
    @JoinColumn(name = "product_group_id")
    private ProductGroup productGroup;

    @ManyToOne()
    @JoinColumn(name = "product_brand_id")
    private ProductBrand productBrand;

    @OneToMany(cascade = CascadeType.ALL)
    private List<ProductProperty> properties;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Media> images;

    @ManyToOne()
    @JoinColumn(name = "location_id")
    private Location location;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
