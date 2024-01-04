package com.springboot.store.service.impl;

import com.springboot.store.entity.DamagedItem;
import com.springboot.store.entity.DamagedItemDetail;
import com.springboot.store.exception.CustomException;
import com.springboot.store.mapper.DamagedItemDetailMapper;
import com.springboot.store.mapper.DamagedItemMapper;
import com.springboot.store.payload.DamagedItemDTO;
import com.springboot.store.repository.DamagedItemRepository;
import com.springboot.store.repository.ProductRepository;
import com.springboot.store.service.ActivityLogService;
import com.springboot.store.service.DamagedItemService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DamagedItemServiceImpl implements DamagedItemService {
    private final DamagedItemRepository damagedItemRepository;
    private final ProductRepository productRepository;
    private final StaffService staffService;
    private final ActivityLogService activityLogService;

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
                product.setStock(product.getStock() - damagedItemDetailDTO.getDamagedQuantity());
                damagedItemDetail.setProduct(product);
                damagedItemDetail.setDamagedItem(damagedItem);
                return damagedItemDetail;
            }).toList());
        }
        DamagedItemDTO damagedItemDTO1 = DamagedItemMapper.toDamagedItemDTO(damagedItemRepository.save(damagedItem));
        activityLogService.save("created a damaged item with id " + damagedItemDTO1.getId(), staffService.getAuthorizedStaff().getId(), new Date());
        return damagedItemDTO1;
    }

    @Override
    public DamagedItemDTO updateDamagedItem(int id, DamagedItemDTO damagedItemDTO) {
        DamagedItem damagedItem = damagedItemRepository.findById(id).orElseThrow(() -> new CustomException("Damaged item not found", HttpStatus.NOT_FOUND));
        damagedItem.setNote(damagedItemDTO.getNote());

        if (damagedItemDTO.getProducts() != null) {
            damagedItem.getProducts().forEach(damagedItemDetail -> {
                var product = productRepository.findById(damagedItemDetail.getProduct().getId()).orElseThrow(() -> new CustomException("Product not found", HttpStatus.NOT_FOUND));
                product.setStock(product.getStock() + damagedItemDetail.getDamagedQuantity());
            });

            damagedItem.getProducts().clear();
            damagedItem.getProducts().addAll(damagedItemDTO.getProducts().stream().map(damagedItemDetailDTO -> {
                DamagedItemDetail damagedItemDetail = DamagedItemDetailMapper.toDamagedItemDetail(damagedItemDetailDTO);
                var product = productRepository.findById(damagedItemDetailDTO.getProductId()).orElseThrow(() -> new CustomException("Product not found", HttpStatus.NOT_FOUND));
                product.setStock(product.getStock() - damagedItemDetailDTO.getDamagedQuantity());
                damagedItemDetail.setProduct(product);
                damagedItemDetail.setDamagedItem(damagedItem);
                return damagedItemDetail;
            }).toList());
        }
        DamagedItemDTO damagedItemDTO1 = DamagedItemMapper.toDamagedItemDTO(damagedItemRepository.save(damagedItem));
        activityLogService.save("updated a damaged item with id " + damagedItemDTO1.getId(), staffService.getAuthorizedStaff().getId(), new Date());

        return damagedItemDTO1;

    }

    @Override
    public void deleteDamagedItem(int id) {
        DamagedItem damagedItem = damagedItemRepository.findById(id).orElseThrow(() -> new CustomException("Damaged item not found", HttpStatus.NOT_FOUND));
        damagedItem.getProducts().forEach(damagedItemDetail -> {
            var product = productRepository.findById(damagedItemDetail.getProduct().getId()).orElseThrow(() -> new CustomException("Product not found", HttpStatus.NOT_FOUND));
            product.setStock(product.getStock() + damagedItemDetail.getDamagedQuantity());
            productRepository.save(product);
        });
        damagedItemRepository.delete(damagedItem);
        activityLogService.save("deleted a damaged item with id " + id, staffService.getAuthorizedStaff().getId(), new Date());
    }
}
