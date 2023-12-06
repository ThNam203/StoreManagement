package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "stock_check_detail")
public class StockCheckDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    private int countedStock;
    private int realStock;
    private int price;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_check_id")
    private StockCheck stockCheck;
}
