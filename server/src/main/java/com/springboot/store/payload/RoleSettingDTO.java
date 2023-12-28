package com.springboot.store.payload;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoleSettingDTO {
    private RolePermissionDTO overview;
    private RolePermissionDTO catalog;
    private RolePermissionDTO discount;
    private RolePermissionDTO stockCheck;
    private RolePermissionDTO invoice;
    private RolePermissionDTO returnInvoice;
    private RolePermissionDTO purchaseOrder;
    private RolePermissionDTO purchaseReturn;
    private RolePermissionDTO damageItems;
    private RolePermissionDTO fundLedger;
    private RolePermissionDTO customer;
    private RolePermissionDTO supplier;
    private RolePermissionDTO report;
    private RolePermissionDTO staff;
}
