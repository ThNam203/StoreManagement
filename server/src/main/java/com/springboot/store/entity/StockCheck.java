package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "stock_check")
public class StockCheck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private Date createdDate;
    @ManyToOne
    @JoinColumn(name = "creator_id")
    private Staff creator;
    @OneToMany(mappedBy = "stockCheck", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StockCheckDetail> products;
    private String note;
    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
