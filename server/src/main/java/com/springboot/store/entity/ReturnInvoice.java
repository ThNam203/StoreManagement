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
@Table(name = "return_invoices")
public class ReturnInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int total;
    private int returnFee;
    private double discountValue;
    private String paymentMethod;
    private String note;
    private Date createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    @OneToMany(mappedBy = "returnInvoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReturnDetail> returnDetails;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
