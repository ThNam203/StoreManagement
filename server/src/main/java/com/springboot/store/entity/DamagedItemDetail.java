package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "damaged_item_detail")
public class DamagedItemDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int damagedQuantity;

    private int costPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "damaged_item_id")
    private DamagedItem damagedItem;
}
