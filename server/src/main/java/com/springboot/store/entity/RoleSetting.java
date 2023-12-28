package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "role_setting")
public class RoleSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "overview_id", referencedColumnName = "id")
    private RolePermission overview;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "catalog_id", referencedColumnName = "id")
    private RolePermission catalog;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "discount_id", referencedColumnName = "id")
    private RolePermission discount;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "stock_check_id", referencedColumnName = "id")
    private RolePermission stockCheck;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "invoice_id", referencedColumnName = "id")
    private RolePermission invoice;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "return_invoice_id", referencedColumnName = "id")
    private RolePermission returnInvoice;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "purchase_order_id", referencedColumnName = "id")
    private RolePermission purchaseOrder;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "purchase_return_id", referencedColumnName = "id")
    private RolePermission purchaseReturn;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "damage_items_id", referencedColumnName = "id")
    private RolePermission damageItems;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "fund_ledger_id", referencedColumnName = "id")
    private RolePermission fundLedger;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private RolePermission customer;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private RolePermission supplier;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "report_id", referencedColumnName = "id")
    private RolePermission report;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "staff_id", referencedColumnName = "id")
    private RolePermission staff;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "attendance_id", referencedColumnName = "id")
    private RolePermission attendance;

    @OneToOne(mappedBy = "roleSetting")
    private Staff owner;
}
