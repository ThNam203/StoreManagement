package com.springboot.store.service.impl;

import com.springboot.store.entity.Product;
import com.springboot.store.entity.ProductBrand;
import com.springboot.store.entity.Staff;
import com.springboot.store.payload.ProductBrandDTO;
import com.springboot.store.payload.ProductDTO;
import com.springboot.store.repository.ProductBrandRepository;
import com.springboot.store.service.ProductBrandService;
import com.springboot.store.service.StaffService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// updated store
@Service
@RequiredArgsConstructor
public class ProductBrandServiceImpl implements ProductBrandService {
    private final ProductBrandRepository productBrandRepository;
    private final ModelMapper modelMapper;
    private final StaffService staffService;

    @Override
    public ProductBrandDTO getProductBrandById(int id) {
        ProductBrand productBrand = productBrandRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ProductBrand not found with id: " + id));
        return modelMapper.map(productBrand, ProductBrandDTO.class);
    }

    @Override
    public List<ProductBrandDTO> getAllProductBrands() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<ProductBrand> productBrands = productBrandRepository.findByStoreId(storeId);
        return productBrands.stream()
                .map(productBrand -> modelMapper.map(productBrand, ProductBrandDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getAllProductsByProductBrandId(int id) {
        ProductBrand productBrand = productBrandRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ProductBrand not found with id: " + id));
        return productBrand.getProducts().stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ProductBrandDTO createProductBrand(ProductBrandDTO productBrandDTO) {
        Staff staff = staffService.getAuthorizedStaff();
        if (productBrandRepository.findByNameAndStoreId(productBrandDTO.getName(), staff.getStore().getId()).isPresent()) {
            throw new RuntimeException("ProductBrand already exists");
        }
        ProductBrand productBrand = modelMapper.map(productBrandDTO, ProductBrand.class);
        productBrand.setStore(staff.getStore());
        productBrand = productBrandRepository.save(productBrand);
        return modelMapper.map(productBrand, ProductBrandDTO.class);
    }

    @Override
    public ProductBrandDTO updateProductBrand(int id, ProductBrandDTO productBrandDTO) {
        ProductBrand existingProductBrand = productBrandRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ProductBrand not found with id: " + id));

        if (productBrandRepository.findByNameAndStoreId(productBrandDTO.getName(), existingProductBrand.getStore().getId()).isPresent()) {
            throw new RuntimeException("ProductBrand already exists");
        }

        // Update existingProductBrand with data from productBrandDTO
        existingProductBrand.setName(productBrandDTO.getName());
        // Update other fields as needed

        existingProductBrand = productBrandRepository.save(existingProductBrand);
        return modelMapper.map(existingProductBrand, ProductBrandDTO.class);
    }

    @Override
    public void deleteProductBrand(int id) {
        ProductBrand productBrand = productBrandRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ProductBrand not found with id: " + id));
        for (Product product : productBrand.getProducts()) {
            product.setProductBrand(null);
        }
        productBrandRepository.deleteById(id);
    }
}
