package com.springboot.store.service.impl;

import com.springboot.store.entity.ProductPropertyName;
import com.springboot.store.payload.ProductPropertyNameDTO;
import com.springboot.store.repository.ProductPropertyNameRepository;
import com.springboot.store.service.ProductPropertyNameService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductPropertyNameServiceImpl implements ProductPropertyNameService {
    private final ProductPropertyNameRepository productPropertyNameRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<ProductPropertyNameDTO> getAllProductPropertyNames() {
        List<ProductPropertyName> productPropertyNameList = productPropertyNameRepository.findAll();
        return productPropertyNameList.stream().map(productPropertyName -> modelMapper.map(productPropertyName, ProductPropertyNameDTO.class)).collect(Collectors.toList());
    }

    @Override
    public ProductPropertyNameDTO getProductPropertyNameById(int id) {
        ProductPropertyName productPropertyName = productPropertyNameRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("ProductPropertyName not found with id: " + id));
        return modelMapper.map(productPropertyName, ProductPropertyNameDTO.class);
    }

    @Override
    public ProductPropertyNameDTO createProductPropertyName(ProductPropertyNameDTO productPropertyNameDTO) {
        ProductPropertyName productPropertyName = modelMapper.map(productPropertyNameDTO, ProductPropertyName.class);
        productPropertyName = productPropertyNameRepository.save(productPropertyName);
        return modelMapper.map(productPropertyName, ProductPropertyNameDTO.class);
    }

    @Override
    public ProductPropertyNameDTO updateProductPropertyName(int id, ProductPropertyNameDTO productPropertyNameDTO) {
        ProductPropertyName existingProductPropertyName = productPropertyNameRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("ProductProperty not found with id: " + id));
        existingProductPropertyName.setName(productPropertyNameDTO.getName());
        existingProductPropertyName = productPropertyNameRepository.save(existingProductPropertyName);
        return modelMapper.map(existingProductPropertyName, ProductPropertyNameDTO.class);
    }

    @Override
    public void deleteProductPropertyName(int id) {
        productPropertyNameRepository.deleteById(id);
    }
}
