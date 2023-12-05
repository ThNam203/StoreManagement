package com.springboot.store.service.impl;

import com.springboot.store.entity.Discount;
import com.springboot.store.entity.DiscountCode;
import com.springboot.store.entity.Staff;
import com.springboot.store.exception.CustomException;
import com.springboot.store.mapper.DiscountCodeMapper;
import com.springboot.store.mapper.DiscountMapper;
import com.springboot.store.payload.DiscountCodeDTO;
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

// updated store
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
        Staff staff = staffService.getAuthorizedStaff();
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
                                productGroupRepository.findByNameAndStoreId(name, staff.getStore().getId())
                                        .orElseThrow(() -> new CustomException("Product group not found", HttpStatus.NOT_FOUND)))
                        .collect(Collectors.toSet()));
        discount.setStore(staff.getStore());
        Discount newDiscount = discountRepository.save(discount);
        return DiscountMapper.toDiscountDTO(newDiscount);
    }

    @Override
    public List<DiscountDTO> getAllDiscounts() {
        Staff staff = staffService.getAuthorizedStaff();
        return discountRepository.findByStoreId(staff.getStore().getId()).stream().map(DiscountMapper::toDiscountDTO).collect(Collectors.toList());
    }

    @Override
    public DiscountDTO getDiscountById(int id) {
        return discountRepository.findById(id)
                .map(DiscountMapper::toDiscountDTO)
                .orElseThrow(() -> new CustomException("Discount not found", HttpStatus.NOT_FOUND));
    }

    @Override
    public DiscountDTO getDiscountByCode(String code) {
        Staff staff = staffService.getAuthorizedStaff();
        DiscountCode discountCode = discountCodeRepository.findByValueAndStoreId(code, staff.getStore().getId())
                .orElseThrow(() -> new CustomException("Discount code not found", HttpStatus.NOT_FOUND));
        if (discountCode.isStatus())
            throw new CustomException("Discount code has been used", HttpStatus.BAD_REQUEST);
        return DiscountMapper.toDiscountDTO(discountCode.getDiscount());
    }

    @Override
    public DiscountDTO updateDiscount(int id, DiscountDTO discountDTO) {
        Staff staff = staffService.getAuthorizedStaff();
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new CustomException("Discount not found", HttpStatus.NOT_FOUND));
        discount.setName(discountDTO.getName());
        discount.setDescription(discountDTO.getDescription());
        discount.setStatus(discountDTO.isStatus());
        discount.setValue(discountDTO.getValue());
        discount.setType(discountDTO.getType());
        discount.setMaxValue(discountDTO.getMaxValue());
        discount.setMinSubTotal(discountDTO.getMinSubTotal());
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
                        .map(productGroupName -> productGroupRepository.findByNameAndStoreId(productGroupName, staff.getStore().getId())
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
    public DiscountCodeDTO generateDiscountCode(int id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new CustomException("Discount not found", HttpStatus.NOT_FOUND));

        String code = "";
        do {
            code = generateRandomCode();
        } while (discountCodeRepository.findByValueAndStoreId(code, staffService.getAuthorizedStaff().getStore().getId()).isPresent());
        DiscountCode discountCode = DiscountCode.builder()
                .value(code)
                .status(false)
                .issuedDate(new Date())
                .store(staffService.getAuthorizedStaff().getStore())
                .discount(discount)
                .build();
        discount.getDiscountCodes().add(discountCode);
        discount.setAmount(discount.getAmount() + 1);
        discountRepository.save(discount);
        return DiscountCodeMapper.toDiscountCodeDTO(discountCode);
    }

    @Override
    public DiscountCode useDiscountCode(String code) {
        DiscountCode discountCode = discountCodeRepository.findByValueAndStoreId(code, staffService.getAuthorizedStaff().getStore().getId())
                .orElseThrow(() -> new CustomException("Discount code not found", HttpStatus.NOT_FOUND));
        if (discountCode.isStatus())
            throw new CustomException("Discount code has been used", HttpStatus.BAD_REQUEST);
        discountCode.getDiscount().setAmount(discountCode.getDiscount().getAmount() - 1);
        discountCode.setStatus(true);
        discountCode.setUsedDate(new Date());
        discountCodeRepository.save(discountCode);
        return discountCode;
    }

    @Override
    public void deleteDiscountCode(int id, List<Integer> ids) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new CustomException("Discount not found", HttpStatus.NOT_FOUND));
        discount.setAmount(discount.getAmount() - ids.size());
        discount.getDiscountCodes().removeIf(discountCode -> ids.contains(discountCode.getId()));
        discountRepository.save(discount);
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
