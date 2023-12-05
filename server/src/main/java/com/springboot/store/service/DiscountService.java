package com.springboot.store.service;

import com.springboot.store.entity.DiscountCode;
import com.springboot.store.payload.DiscountCodeDTO;
import com.springboot.store.payload.DiscountDTO;

import java.util.List;

public interface DiscountService {
    DiscountDTO createDiscount(DiscountDTO discountDTO);
    List<DiscountDTO> getAllDiscounts();
    DiscountDTO getDiscountById(int id);
    DiscountDTO getDiscountByCode(String code);
    DiscountDTO updateDiscount(int id, DiscountDTO discountDTO);
    void deleteDiscount(int id);
    DiscountCodeDTO generateDiscountCode(int id);
    DiscountCode useDiscountCode(String code);
    void deleteDiscountCode(int id, List<Integer> ids);
}
