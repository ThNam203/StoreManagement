package com.springboot.store.service.impl;

import com.springboot.store.entity.ProductBrand;
import com.springboot.store.payload.ProductBrandDTO;
import com.springboot.store.repository.ProductBrandRepository;
import com.springboot.store.service.ProductBrandService;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductBrandServiceImpl implements ProductBrandService {
    private final ProductBrandRepository productBrandRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public ProductBrandServiceImpl(ProductBrandRepository productBrandRepository, ModelMapper modelMapper) {
        this.productBrandRepository = productBrandRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public ProductBrandDTO getProductBrandById(int id) {
        ProductBrand productBrand = productBrandRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ProductBrand not found with id: " + id));
        return modelMapper.map(productBrand, ProductBrandDTO.class);
    }

    @Override
    public List<ProductBrandDTO> getAllProductBrands() {
        List<ProductBrand> productBrands = productBrandRepository.findAll();
        return productBrands.stream()
                .map(productBrand -> modelMapper.map(productBrand, ProductBrandDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ProductBrandDTO createProductBrand(ProductBrandDTO productBrandDTO) {
        ProductBrand productBrand = modelMapper.map(productBrandDTO, ProductBrand.class);
        productBrand = productBrandRepository.save(productBrand);
        return modelMapper.map(productBrand, ProductBrandDTO.class);
    }

    @Override
    public ProductBrandDTO updateProductBrand(int id, ProductBrandDTO productBrandDTO) {
        ProductBrand existingProductBrand = productBrandRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ProductBrand not found with id: " + id));

        // Update existingProductBrand with data from productBrandDTO
        existingProductBrand.setName(productBrandDTO.getName());
        // Update other fields as needed

        existingProductBrand = productBrandRepository.save(existingProductBrand);
        return modelMapper.map(existingProductBrand, ProductBrandDTO.class);
    }

    @Override
    public void deleteProductBrand(int id) {
        productBrandRepository.deleteById(id);
    }
}
