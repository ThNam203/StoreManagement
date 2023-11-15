package com.springboot.store.mapper;

import com.springboot.store.entity.ProductGroup;
import com.springboot.store.payload.ProductGroupDTO;

public class ProductGroupMapper {
    public static ProductGroupDTO toProductGroupDTO(ProductGroup productGroup) {
        return ProductGroupDTO.builder()
                .id(productGroup.getId())
                .name(productGroup.getName())
                .description(productGroup.getDescription())
                .createdAt(productGroup.getCreatedAt())
                .build();
    }
    public static ProductGroup toProductGroup(ProductGroupDTO productGroupDTO) {
        return ProductGroup.builder()
                .id(productGroupDTO.getId())
                .name(productGroupDTO.getName())
                .description(productGroupDTO.getDescription())
                .createdAt(productGroupDTO.getCreatedAt())
                .build();
    }
}
