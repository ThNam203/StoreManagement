package com.springboot.store.service.impl;

import com.springboot.store.entity.SupplierGroup;
import com.springboot.store.exception.CustomException;
import com.springboot.store.mapper.SupplierGroupMapper;
import com.springboot.store.payload.SupplierGroupDTO;
import com.springboot.store.repository.SupplierGroupRepository;
import com.springboot.store.service.StaffService;
import com.springboot.store.service.SupplierGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierGroupServiceImpl implements SupplierGroupService {
    private final SupplierGroupRepository supplierGroupRepository;
    private final StaffService staffService;
    @Override
    public List<SupplierGroupDTO> getAllSupplierGroups() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<SupplierGroup> supplierGroups = supplierGroupRepository.findByStoreId(storeId);
        return supplierGroups.stream().map(SupplierGroupMapper::toSupplierGroupDTO).toList();
    }

    @Override
    public SupplierGroupDTO getSupplierGroupById(int id) {
        SupplierGroup supplierGroup = supplierGroupRepository.findById(id).orElseThrow(() -> new CustomException("Supplier group not found", HttpStatus.NOT_FOUND));
        return SupplierGroupMapper.toSupplierGroupDTO(supplierGroup);
    }

    @Override
    public SupplierGroupDTO createSupplierGroup(SupplierGroupDTO supplierGroupDTO) {
        if (supplierGroupRepository.findByNameAndStoreId(supplierGroupDTO.getName(), staffService.getAuthorizedStaff().getStore().getId()).isPresent()) {
            throw new CustomException("Supplier group name already exists", HttpStatus.BAD_REQUEST);
        }
        SupplierGroup supplierGroup = SupplierGroupMapper.toSupplierGroup(supplierGroupDTO);
        supplierGroup.setStore(staffService.getAuthorizedStaff().getStore());
        supplierGroup.setCreator(staffService.getAuthorizedStaff());
        supplierGroup.setCreatedAt(new Date());
        return SupplierGroupMapper.toSupplierGroupDTO(supplierGroupRepository.save(supplierGroup));
    }

    @Override
    public SupplierGroupDTO updateSupplierGroup(int id, SupplierGroupDTO supplierGroupDTO) {
        if (supplierGroupRepository.findByNameAndStoreId(supplierGroupDTO.getName(), staffService.getAuthorizedStaff().getStore().getId()).isPresent()) {
            throw new CustomException("Supplier group name already exists", HttpStatus.BAD_REQUEST);
        }
        SupplierGroup supplierGroup = supplierGroupRepository.findById(id).orElseThrow(() -> new CustomException("Supplier group not found", HttpStatus.NOT_FOUND));
        supplierGroup.setName(supplierGroupDTO.getName());
        supplierGroup.setDescription(supplierGroupDTO.getDescription());
        supplierGroup.setAddress(supplierGroupDTO.getAddress());
        supplierGroup.setCompany(supplierGroupDTO.getCompany());
        return SupplierGroupMapper.toSupplierGroupDTO(supplierGroupRepository.save(supplierGroup));
    }

    @Override
    public void deleteSupplierGroup(int id) {
        SupplierGroup supplierGroup = supplierGroupRepository.findById(id).orElseThrow(() -> new CustomException("Supplier group not found", HttpStatus.NOT_FOUND));
        supplierGroupRepository.delete(supplierGroup);
    }
}
