package com.springboot.store.service.impl;

import com.springboot.store.entity.ProductProperty;
import com.springboot.store.payload.ProductPropertyDTO;
import com.springboot.store.repository.ProductPropertyRepository;
import com.springboot.store.service.ProductPropertyService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductPropertyServiceImpl implements ProductPropertyService {
    private final ProductPropertyRepository productPropertyRepository;
    private final ModelMapper modelMapper;

    @Override
    public ProductPropertyDTO getProductPropertyById(int id) {
        ProductProperty productProperty = productPropertyRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("ProductProperty not found with id: " + id));
        return modelMapper.map(productProperty, ProductPropertyDTO.class);
    }

    @Override
    public List<ProductPropertyDTO> getAllProductProperties() {
        List<ProductProperty> productProperties = productPropertyRepository.findAll();
        return productProperties.stream()
                .map(productProperty -> modelMapper.map(productProperty, ProductPropertyDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ProductPropertyDTO createProductProperty(ProductPropertyDTO productPropertyDTO) {
        ProductProperty productProperty = modelMapper.map(productPropertyDTO, ProductProperty.class);
        productProperty = productPropertyRepository.save(productProperty);
        return modelMapper.map(productProperty, ProductPropertyDTO.class);
    }

    @Override
    public ProductPropertyDTO updateProductProperty(int id, ProductPropertyDTO productPropertyDTO) {
        ProductProperty existingProductProperty = productPropertyRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("ProductProperty not found with id: " + id));
        existingProductProperty.setName(productPropertyDTO.getName());
        existingProductProperty.setValue(productPropertyDTO.getValue());
        existingProductProperty = productPropertyRepository.save(existingProductProperty);
        return modelMapper.map(existingProductProperty, ProductPropertyDTO.class);
    }

    @Override
    public void deleteProductProperty(int id) {
        productPropertyRepository.deleteById(id);
    }
}
