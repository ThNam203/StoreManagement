package com.springboot.store.mapper;

import com.springboot.store.entity.DamagedItem;
import com.springboot.store.payload.DamagedItemDTO;

public class DamagedItemMapper {
    public static DamagedItemDTO toDamagedItemDTO(DamagedItem damagedItem) {
        return DamagedItemDTO.builder()
                .id(damagedItem.getId())
                .createdDate(damagedItem.getCreatedDate())
                .note(damagedItem.getNote())
                .creatorId(damagedItem.getCreator() == null ? null : damagedItem.getCreator().getId())
                .products(damagedItem.getProducts() == null ? null : damagedItem.getProducts()
                        .stream()
                        .map(DamagedItemDetailMapper::toDamagedItemDetailDTO)
                        .toList())
                .build();
    }
    public static DamagedItem toDamagedItem(DamagedItemDTO damagedItemDTO) {
        return DamagedItem.builder()
                .createdDate(damagedItemDTO.getCreatedDate())
                .note(damagedItemDTO.getNote())
                .build();
    }
}
