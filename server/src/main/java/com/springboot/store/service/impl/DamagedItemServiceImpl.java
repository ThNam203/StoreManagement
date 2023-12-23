package com.springboot.store.service.impl;

import com.springboot.store.entity.DamagedItem;
import com.springboot.store.entity.DamagedItemDetail;
import com.springboot.store.exception.CustomException;
import com.springboot.store.mapper.DamagedItemDetailMapper;
import com.springboot.store.mapper.DamagedItemMapper;
import com.springboot.store.payload.DamagedItemDTO;
import com.springboot.store.repository.DamagedItemRepository;
import com.springboot.store.repository.ProductRepository;
import com.springboot.store.service.DamagedItemService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DamagedItemServiceImpl implements DamagedItemService {
    private final DamagedItemRepository damagedItemRepository;
    private final ProductRepository productRepository;
    private final StaffService staffService;
    @Override
    public List<DamagedItemDTO> getAllDamagedItems() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<DamagedItem> damagedItems = damagedItemRepository.findByStoreId(storeId);
        return damagedItems.stream().map(DamagedItemMapper::toDamagedItemDTO).toList();
    }

    @Override
    public DamagedItemDTO getDamagedItemById(int id) {
        DamagedItem damagedItem = damagedItemRepository.findById(id).orElseThrow(() -> new CustomException("Damaged item not found", HttpStatus.NOT_FOUND));
        return DamagedItemMapper.toDamagedItemDTO(damagedItem);
    }

    @Override
    public DamagedItemDTO createDamagedItem(DamagedItemDTO damagedItemDTO) {
        DamagedItem damagedItem = DamagedItemMapper.toDamagedItem(damagedItemDTO);
        damagedItem.setCreator(staffService.getAuthorizedStaff());
        damagedItem.setStore(staffService.getAuthorizedStaff().getStore());

        if (damagedItemDTO.getProducts() != null) {
            damagedItem.setProducts(damagedItemDTO.getProducts().stream().map(damagedItemDetailDTO -> {
                DamagedItemDetail damagedItemDetail = DamagedItemDetailMapper.toDamagedItemDetail(damagedItemDetailDTO);
                var product = productRepository.findById(damagedItemDetailDTO.getProductId()).orElseThrow(() -> new CustomException("Product not found", HttpStatus.NOT_FOUND));
                damagedItemDetail.setProduct(product);
                damagedItemDetail.setDamagedItem(damagedItem);
                return damagedItemDetail;
            }).toList());
        }

        return DamagedItemMapper.toDamagedItemDTO(damagedItemRepository.save(damagedItem));
    }

    @Override
    public DamagedItemDTO updateDamagedItem(int id, DamagedItemDTO damagedItemDTO) {
        DamagedItem damagedItem = damagedItemRepository.findById(id).orElseThrow(() -> new CustomException("Damaged item not found", HttpStatus.NOT_FOUND));
        damagedItem.setNote(damagedItemDTO.getNote());

        if (damagedItemDTO.getProducts() != null) {
            damagedItem.getProducts().clear();
            damagedItem.getProducts().addAll(damagedItemDTO.getProducts().stream().map(damagedItemDetailDTO -> {
                DamagedItemDetail damagedItemDetail = DamagedItemDetailMapper.toDamagedItemDetail(damagedItemDetailDTO);
                var product = productRepository.findById(damagedItemDetailDTO.getProductId()).orElseThrow(() -> new CustomException("Product not found", HttpStatus.NOT_FOUND));
                damagedItemDetail.setProduct(product);
                damagedItemDetail.setDamagedItem(damagedItem);
                return damagedItemDetail;
            }).toList());
        }

        return DamagedItemMapper.toDamagedItemDTO(damagedItemRepository.save(damagedItem));

    }

    @Override
    public void deleteDamagedItem(int id) {
        DamagedItem damagedItem = damagedItemRepository.findById(id).orElseThrow(() -> new CustomException("Damaged item not found", HttpStatus.NOT_FOUND));
        damagedItemRepository.delete(damagedItem);
    }
}
