package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "expense_forms")
public class ExpenseForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(name = "receiver_type")
    String receiverType;

    @Column(name = "created_date")
    Date createdDate;

    @Column(name = "expense_type")
    String expenseType;

    @Column(name = "value")
    int value;

    @ManyToOne()
    @JoinColumn(name = "creator_id")
    Staff creator;

    @Column(name = "id_payer")
    int idPayer;

    @Column(name = "note")
    String note;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    Store store;
}
