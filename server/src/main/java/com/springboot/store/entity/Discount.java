package com.springboot.store.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.springboot.store.utils.DiscountE;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "coupons")
@Builder
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private boolean status;

    @Column(name = "value", nullable = false)
    private double value;

    @Column(name = "type", nullable = false)
    private DiscountE type;

    @Column(name = "max_total")
    private int maxTotal;

    @Column(name = "min_total")
    private int minTotal;

    @Column(name = "amount", nullable = false)
    private int amount;

    @Column(name = "created_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;

    @Column(name = "start_date")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date startDate;

    @Column(name = "end_date")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date endDate;

    @OneToMany(mappedBy = "discount", cascade = CascadeType.ALL)
    private Set<DiscountCode> discountCodes;

    @ManyToMany
    @JoinTable(
            name = "coupon_product",
            joinColumns = @JoinColumn(name = "coupon_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private Set<Product> products;

    @ManyToMany
    @JoinTable(
            name = "coupon_product_group",
            joinColumns = @JoinColumn(name = "coupon_id"),
            inverseJoinColumns = @JoinColumn(name = "product_group_id")
    )
    private Set<ProductGroup> productGroups;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private Staff creator;
}
