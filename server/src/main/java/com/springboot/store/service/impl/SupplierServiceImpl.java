package com.springboot.store.service.impl;

import com.springboot.store.entity.Media;
import com.springboot.store.entity.Staff;
import com.springboot.store.entity.Supplier;
import com.springboot.store.exception.CustomException;
import com.springboot.store.mapper.SupplierMapper;
import com.springboot.store.payload.SupplierDTO;
import com.springboot.store.repository.MediaRepository;
import com.springboot.store.repository.SupplierGroupRepository;
import com.springboot.store.repository.SupplierRepository;
import com.springboot.store.service.FileService;
import com.springboot.store.service.StaffService;
import com.springboot.store.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {
    private final SupplierRepository supplierRepository;
    private final SupplierGroupRepository supplierGroupRepository;
    private final MediaRepository mediaRepository;
    private final FileService fileService;
    private final StaffService staffService;
    @Override
    public List<SupplierDTO> getAllSuppliers() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<Supplier> suppliers = supplierRepository.findByStoreId(storeId);
        return suppliers.stream().map(SupplierMapper::toSupplierDTO).toList();
    }

    @Override
    public SupplierDTO getSupplierById(int id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new CustomException("Supplier not found", HttpStatus.NOT_FOUND));
        return SupplierMapper.toSupplierDTO(supplier);
    }

    @Override
    public SupplierDTO createSupplier(SupplierDTO supplierDTO, MultipartFile file) {
        Staff creator = staffService.getAuthorizedStaff();
        Supplier supplier = SupplierMapper.toSupplier(supplierDTO);
        supplier.setCreatedAt(new Date());
        supplier.setCreator(creator);
        supplier.setStore(creator.getStore());
        if (supplierDTO.getSupplierGroupName() != null) {
            supplier.setSupplierGroup(supplierGroupRepository
                    .findByNameAndStoreId(supplierDTO.getSupplierGroupName(), creator.getStore().getId())
                    .orElseThrow(() -> new CustomException("Supplier group not found with name: " + supplierDTO.getSupplierGroupName(), HttpStatus.NOT_FOUND)));

        }

        if (file != null && !file.isEmpty()) {
            String avatarUrl = fileService.uploadFile(file);
            Media avatar = Media.builder()
                    .url(avatarUrl)
                    .build();
            avatar = mediaRepository.save(avatar);
            supplier.setImage(avatar);
        }

        return SupplierMapper.toSupplierDTO(supplierRepository.save(supplier));
    }

    @Override
    public SupplierDTO updateSupplier(int id, SupplierDTO supplierDTO, MultipartFile file) {
        Staff creator = staffService.getAuthorizedStaff();
        Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new CustomException("Supplier not found", HttpStatus.NOT_FOUND));
        supplier.setName(supplierDTO.getName());
        supplier.setAddress(supplierDTO.getAddress());
        supplier.setPhoneNumber(supplierDTO.getPhoneNumber());
        supplier.setEmail(supplierDTO.getEmail());
        supplier.setDescription(supplierDTO.getDescription());
        supplier.setCompanyName(supplierDTO.getCompanyName());
        supplier.setStatus(supplierDTO.getStatus());
//        supplier.setCreatedAt(new Date());
//        supplier.setCreator(creator);
//        supplier.setStore(creator.getStore());
        if (supplierDTO.getSupplierGroupName() != null) {
            supplier.setSupplierGroup(supplierGroupRepository
                    .findByNameAndStoreId(supplierDTO.getSupplierGroupName(), creator.getStore().getId())
                    .orElseThrow(() -> new CustomException("Supplier group not found with name: " + supplierDTO.getSupplierGroupName(), HttpStatus.NOT_FOUND)));

        }

        if (file != null && !file.isEmpty()) {
            String avatarUrl = fileService.uploadFile(file);
            Media avatar = Media.builder()
                    .url(avatarUrl)
                    .build();
            avatar = mediaRepository.save(avatar);
            supplier.setImage(avatar);
        }

        return SupplierMapper.toSupplierDTO(supplierRepository.save(supplier));
    }

    @Override
    public void deleteSupplier(int id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new CustomException("Supplier not found", HttpStatus.NOT_FOUND));
        supplierRepository.delete(supplier);
    }
}
