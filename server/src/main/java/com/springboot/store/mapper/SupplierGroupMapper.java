package com.springboot.store.mapper;

import com.springboot.store.entity.SupplierGroup;
import com.springboot.store.payload.SupplierGroupDTO;

public class SupplierGroupMapper {
    public static SupplierGroup toSupplierGroup(SupplierGroupDTO supplierGroupDTO) {
        return SupplierGroup.builder()
                .name(supplierGroupDTO.getName())
                .description(supplierGroupDTO.getDescription())
                .address(supplierGroupDTO.getAddress())
                .company(supplierGroupDTO.getCompany())
                .createdAt(supplierGroupDTO.getCreatedAt())
                .build();
    }
    public static SupplierGroupDTO toSupplierGroupDTO(SupplierGroup supplierGroup) {
        return SupplierGroupDTO.builder()
                .id(supplierGroup.getId())
                .name(supplierGroup.getName())
                .description(supplierGroup.getDescription())
                .address(supplierGroup.getAddress())
                .company(supplierGroup.getCompany())
                .createdAt(supplierGroup.getCreatedAt())
                .creatorId(supplierGroup.getCreator() != null ? supplierGroup.getCreator().getId() : null)
                .build();
    }
}
