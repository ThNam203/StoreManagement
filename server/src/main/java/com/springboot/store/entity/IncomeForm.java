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
@Table(name = "income_forms")
public class IncomeForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(name = "payer_type")
    String payerType;

    @Column(name = "date")
    Date date;

    @Column(name = "income_type")
    String incomeType;

    @Column(name = "value")
    int value;

    @ManyToOne()
    @JoinColumn(name = "creator_id")
    Staff creator;

    @Column(name = "id_payer")
    int idPayer;

    @Column(name = "note")
    String note;

    @Column(name = "description")
    String description;

    @Column(name = "linked_form_id")
    int linkedFormId;

    @ManyToOne()
    @JoinColumn(name = "store_id")
    Store store;
}
