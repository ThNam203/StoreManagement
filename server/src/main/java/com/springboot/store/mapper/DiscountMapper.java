package com.springboot.store.mapper;

import com.springboot.store.entity.Discount;
import com.springboot.store.entity.DiscountCode;
import com.springboot.store.entity.Product;
import com.springboot.store.entity.ProductGroup;
import com.springboot.store.payload.DiscountDTO;

import java.util.stream.Collectors;

public class DiscountMapper {
    public static DiscountDTO toDiscountDTO(Discount discount) {
        return DiscountDTO.builder()
                .id(discount.getId())
                .name(discount.getName())
                .description(discount.getDescription())
                .status(discount.isStatus())
                .value(discount.getValue())
                .type(discount.getType())
                .maxValue(discount.getMaxValue())
                .minSubTotal(discount.getMinSubTotal())
                .amount(discount.getAmount())
                .createdAt(discount.getCreatedAt())
                .startDate(discount.getStartDate())
                .endDate(discount.getEndDate())
                .creatorId(discount.getCreator() == null ? null : discount.getCreator().getId())
                .discountCodes(discount.getDiscountCodes() == null ? null :
                        discount.getDiscountCodes().stream().map(DiscountCodeMapper::toDiscountCodeDTO).collect(Collectors.toSet()))
                .productIds(discount.getProducts() == null ? null :
                        discount.getProducts().stream().map(Product::getId).collect(Collectors.toSet()))
                .productGroups(discount.getProductGroups() == null ? null :
                        discount.getProductGroups().stream().map(ProductGroup::getName).collect(Collectors.toSet()))
                .build();
    }
    public static Discount toDiscount(DiscountDTO discountDTO) {
        return Discount.builder()
                .name(discountDTO.getName())
                .description(discountDTO.getDescription())
                .status(discountDTO.isStatus())
                .value(discountDTO.getValue())
                .type(discountDTO.getType())
                .maxValue(discountDTO.getMaxValue())
                .minSubTotal(discountDTO.getMinSubTotal())
                .amount(discountDTO.getAmount())
                .createdAt(discountDTO.getCreatedAt())
                .startDate(discountDTO.getStartDate())
                .endDate(discountDTO.getEndDate())
                .build();
    }
}
