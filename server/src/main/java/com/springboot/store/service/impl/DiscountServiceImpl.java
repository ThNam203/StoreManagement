package com.springboot.store.service.impl;

import com.springboot.store.entity.Discount;
import com.springboot.store.entity.DiscountCode;
import com.springboot.store.exception.CustomException;
import com.springboot.store.mapper.DiscountMapper;
import com.springboot.store.payload.DiscountDTO;
import com.springboot.store.repository.DiscountCodeRepository;
import com.springboot.store.repository.DiscountRepository;
import com.springboot.store.repository.ProductGroupRepository;
import com.springboot.store.repository.ProductRepository;
import com.springboot.store.service.DiscountService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscountServiceImpl implements DiscountService {
    private final DiscountRepository discountRepository;
    private final DiscountCodeRepository discountCodeRepository;
    private final ProductRepository productRepository;
    private final ProductGroupRepository productGroupRepository;
    private final StaffService staffService;

    @Override
    public DiscountDTO createDiscount(DiscountDTO discountDTO) {
        Discount discount = DiscountMapper.toDiscount(discountDTO);
        discount.setCreatedAt(new Date());
        discount.setCreator(staffService.getAuthorizedStaff());
        discount.setProducts(discountDTO.getProductIds() == null ? null :
                discountDTO.getProductIds()
                        .stream()
                        .map(id ->
                                productRepository.findById(id)
                                        .orElseThrow(() -> new CustomException("Product not found", HttpStatus.NOT_FOUND)))
                        .collect(Collectors.toSet()));
        discount.setProductGroups(discountDTO.getProductGroups() == null ? null :
                discountDTO.getProductGroups()
                        .stream()
                        .map(name ->
                                productGroupRepository.findByName(name)
                                        .orElseThrow(() -> new CustomException("Product group not found", HttpStatus.NOT_FOUND)))
                        .collect(Collectors.toSet()));
        Discount newDiscount = discountRepository.save(discount);
        return DiscountMapper.toDiscountDTO(newDiscount);
    }

    @Override
    public List<DiscountDTO> getAllDiscounts() {
        return discountRepository.findAll().stream().map(DiscountMapper::toDiscountDTO).collect(Collectors.toList());
    }

    @Override
    public DiscountDTO getDiscountById(int id) {
        return discountRepository.findById(id)
                .map(DiscountMapper::toDiscountDTO)
                .orElseThrow(() -> new CustomException("Discount not found", HttpStatus.NOT_FOUND));
    }

    @Override
    public DiscountDTO getDiscountByCode(String code) {
        DiscountCode discountCode = discountCodeRepository.findByCode(code)
                .orElseThrow(() -> new CustomException("Discount code not found", HttpStatus.NOT_FOUND));
        if (discountCode.isUsed())
            throw new CustomException("Discount code has been used", HttpStatus.BAD_REQUEST);
        return DiscountMapper.toDiscountDTO(discountCode.getDiscount());
    }

    @Override
    public DiscountDTO updateDiscount(int id, DiscountDTO discountDTO) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new CustomException("Discount not found", HttpStatus.NOT_FOUND));
        discount.setName(discountDTO.getName());
        discount.setDescription(discountDTO.getDescription());
        discount.setStatus(discountDTO.isStatus());
        discount.setValue(discountDTO.getValue());
        discount.setType(discountDTO.getType());
        discount.setAmount(discountDTO.getAmount());
        discount.setStartDate(discountDTO.getStartDate());
        discount.setEndDate(discountDTO.getEndDate());
        discount.setProducts(discountDTO.getProductIds() == null ? null :
                discountDTO.getProductIds()
                        .stream()
                        .map(productId -> productRepository.findById(productId)
                                        .orElseThrow(() -> new CustomException("Product not found", HttpStatus.NOT_FOUND)))
                        .collect(Collectors.toSet()));
        discount.setProductGroups(discountDTO.getProductGroups() == null ? null :
                discountDTO.getProductGroups()
                        .stream()
                        .map(productGroupName -> productGroupRepository.findByName(productGroupName)
                                        .orElseThrow(() -> new CustomException("Product group not found", HttpStatus.NOT_FOUND)))
                        .collect(Collectors.toSet()));
        Discount newDiscount = discountRepository.save(discount);
        return DiscountMapper.toDiscountDTO(newDiscount);
    }

    @Override
    public void deleteDiscount(int id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new CustomException("Discount not found", HttpStatus.NOT_FOUND));
        discountRepository.delete(discount);
    }

    @Override
    public String generateDiscountCode(int id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new CustomException("Discount not found", HttpStatus.NOT_FOUND));

        String code = "";
        do {
            code = generateRandomCode();
        } while (discountCodeRepository.existsByCode(code));
        discount.getDiscountCodes().add(DiscountCode.builder()
                .code(code)
                .discount(discount)
                .build());
        discount.setAmount(discount.getAmount() + 1);
        discountRepository.save(discount);
        return code;
    }

    @Override
    public DiscountCode useDiscountCode(String code) {
        DiscountCode discountCode = discountCodeRepository.findByCode(code)
                .orElseThrow(() -> new CustomException("Discount code not found", HttpStatus.NOT_FOUND));
        if (discountCode.isUsed())
            throw new CustomException("Discount code has been used", HttpStatus.BAD_REQUEST);
        discountCode.getDiscount().setAmount(discountCode.getDiscount().getAmount() - 1);
        discountCode.setUsed(true);
        discountCodeRepository.save(discountCode);
        return discountCode;
    }

    @Override
    public void deleteDiscountCode(int id, String code) {

    }

//    random code with 8 characters including uppercase letters and numbers
    private String generateRandomCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(8);
        for (int i = 0; i < 8; i++) {
            int randomIndex = random.nextInt(chars.length());
            char randomChar = chars.charAt(randomIndex);
            sb.append(randomChar);
        }
        return sb.toString();
    }
}
