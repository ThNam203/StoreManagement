package com.springboot.store.service.impl;

import com.springboot.store.entity.ProductGroup;
import com.springboot.store.entity.Staff;
import com.springboot.store.mapper.ProductGroupMapper;
import com.springboot.store.mapper.ProductMapper;
import com.springboot.store.payload.ProductDTO;
import com.springboot.store.payload.ProductGroupDTO;
import com.springboot.store.repository.ProductGroupRepository;
import com.springboot.store.service.ProductGroupService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

// updated store
@Service
@RequiredArgsConstructor
public class ProductGroupServiceImpl implements ProductGroupService {
    private final ProductGroupRepository productGroupRepository;
    private final StaffService staffService;
    @Override
    public ProductGroupDTO getProductGroupById(int id) {
        ProductGroup productGroup = productGroupRepository.findById(id).orElseThrow(() -> new RuntimeException("Product group not found"));
        return ProductGroupMapper.toProductGroupDTO(productGroup);
    }

    @Override
    public List<ProductGroupDTO> getAllProductGroups() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<ProductGroup> productGroups = productGroupRepository.findByStoreId(storeId);
        return productGroups.stream()
                .map(ProductGroupMapper::toProductGroupDTO)
                .toList();
    }

    @Override
    public List<ProductDTO> getAllProductsByProductGroupId(int id) {
        ProductGroup productGroup = productGroupRepository.findById(id).orElseThrow(() -> new RuntimeException("Product group not found"));
        return productGroup.getProducts().stream()
                .map(ProductMapper::toProductDTO)
                .toList();
    }

    @Override
    public ProductGroupDTO createProductGroup(ProductGroupDTO productGroupDTO) {
        Staff staff = staffService.getAuthorizedStaff();
        if (productGroupRepository.findByNameAndStoreId(productGroupDTO.getName(), staff.getStore().getId()).isPresent()) {
            throw new RuntimeException("Product group already exists");
        }
        productGroupDTO.setCreatedAt(new Date());
        ProductGroup productGroup = ProductGroupMapper.toProductGroup(productGroupDTO);
        productGroup.setStore(staff.getStore());
        productGroupRepository.save(productGroup);
        return ProductGroupMapper.toProductGroupDTO(productGroup);
    }

    @Override
    public ProductGroupDTO updateProductGroup(int id, ProductGroupDTO productGroupDTO) {
        ProductGroup productGroup = productGroupRepository.findById(id).orElseThrow(() -> new RuntimeException("Product group not found"));
        if (productGroupRepository.findByNameAndStoreId(productGroupDTO.getName(), staffService.getAuthorizedStaff().getStore().getId()).isPresent()) {
            throw new RuntimeException("Product group already exists");
        }
        productGroup.setName(productGroupDTO.getName());
        productGroup.setDescription(productGroupDTO.getDescription());

        productGroupRepository.save(productGroup);
        return ProductGroupMapper.toProductGroupDTO(productGroup);
    }

    @Override
    public void deleteProductGroup(int id) {
        ProductGroup productGroup = productGroupRepository.findById(id).orElseThrow(() -> new RuntimeException("Product group not found"));
        productGroupRepository.delete(productGroup);
    }
}
