package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "damaged_item")
public class DamagedItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private Date createdDate;
    @ManyToOne
    @JoinColumn(name = "creator_id")
    private Staff creator;
    @OneToMany(mappedBy = "damagedItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DamagedItemDetail> products;
    private String note;
    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
