package com.springboot.store.service.impl;

import com.springboot.store.entity.ProductProperty;
import com.springboot.store.entity.ProductPropertyName;
import com.springboot.store.payload.ProductPropertyNameDTO;
import com.springboot.store.repository.ProductPropertyNameRepository;
import com.springboot.store.service.ProductPropertyNameService;
import com.springboot.store.service.StaffService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// updated store
@Service
@RequiredArgsConstructor
public class ProductPropertyNameServiceImpl implements ProductPropertyNameService {
    private final ProductPropertyNameRepository productPropertyNameRepository;
    private final ModelMapper modelMapper;
    private final StaffService staffService;

    @Override
    public List<ProductPropertyNameDTO> getAllProductPropertyNames() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<ProductPropertyName> productPropertyNameList = productPropertyNameRepository.findByStoreId(storeId);
        return productPropertyNameList.stream().map(productPropertyName -> modelMapper.map(productPropertyName, ProductPropertyNameDTO.class)).collect(Collectors.toList());
    }

    @Override
    public ProductPropertyNameDTO getProductPropertyNameById(int id) {
        ProductPropertyName productPropertyName = productPropertyNameRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("ProductPropertyName not found with id: " + id));
        return modelMapper.map(productPropertyName, ProductPropertyNameDTO.class);
    }

    @Override
    public ProductPropertyNameDTO createProductPropertyName(ProductPropertyNameDTO productPropertyNameDTO) {
        if (productPropertyNameRepository.findByNameAndStoreId(productPropertyNameDTO.getName(), staffService.getAuthorizedStaff().getStore().getId()).isPresent()) {
            throw new RuntimeException("ProductPropertyName already exists");
        }
        ProductPropertyName productPropertyName = modelMapper.map(productPropertyNameDTO, ProductPropertyName.class);
        productPropertyName.setStore(staffService.getAuthorizedStaff().getStore());
        productPropertyName = productPropertyNameRepository.save(productPropertyName);
        return modelMapper.map(productPropertyName, ProductPropertyNameDTO.class);
    }

    @Override
    public ProductPropertyNameDTO updateProductPropertyName(int id, ProductPropertyNameDTO productPropertyNameDTO) {
        if (productPropertyNameRepository.findByNameAndStoreId(productPropertyNameDTO.getName(), staffService.getAuthorizedStaff().getStore().getId()).isPresent()) {
            throw new RuntimeException("ProductPropertyName already exists");
        }
        ProductPropertyName existingProductPropertyName = productPropertyNameRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("ProductProperty not found with id: " + id));
        existingProductPropertyName.setName(productPropertyNameDTO.getName());
        existingProductPropertyName = productPropertyNameRepository.save(existingProductPropertyName);
        return modelMapper.map(existingProductPropertyName, ProductPropertyNameDTO.class);
    }

    @Override
    public void deleteProductPropertyName(int id) {
        ProductPropertyName existingProductPropertyName = productPropertyNameRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("ProductProperty not found with id: " + id));
        for (ProductProperty productProperty : existingProductPropertyName.getProductProperties()) {
            productProperty.setPropertyName(null);
        }
        productPropertyNameRepository.deleteById(id);
    }
}
