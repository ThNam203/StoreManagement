package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "suppliers")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "description")
    private String description;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "status")
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private Staff creator;

    @ManyToOne()
    @JoinColumn(name = "supplier_group_id")
    private SupplierGroup supplierGroup;

    @OneToOne(cascade = CascadeType.ALL)
    private Media image;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
