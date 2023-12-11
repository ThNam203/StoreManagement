package com.springboot.store.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.springboot.store.utils.StatusE;
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
@Table(name = "invoices")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name ="cash")
    private double cash;

    @Column(name ="changed")
    private double changed;

    @Column(name ="sub_total")
    private double subTotal;

    @Column(name ="discount")
    private double discount;

    @Column(name ="total")
    private double total;

    @Column(name ="status")
    private Boolean status;

    @Column(name ="payment_method")
    private String paymentMethod;

    @Column(name ="created_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @OneToOne()
    private DiscountCode discountCode;

    @OneToMany(cascade = CascadeType.ALL)
    private Set<InvoiceDetail> invoiceDetails;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
