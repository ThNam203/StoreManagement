package com.springboot.store.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "receipt")
public class Receipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "value")
    private int value;

    @Column(name = "type")
    private String type;

    @Column(name = "target")
    private String Target;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private Staff creator;

    @ManyToOne
    @JoinColumn(name = "receipt_type_id")
    private ReceiptType receiptType;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    private Store store;
}
