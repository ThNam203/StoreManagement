package com.springboot.store.service;

import com.springboot.store.payload.SupplierGroupDTO;

import java.util.List;

public interface SupplierGroupService {
    List<SupplierGroupDTO> getAllSupplierGroups();
    SupplierGroupDTO getSupplierGroupById(int id);
    SupplierGroupDTO createSupplierGroup(SupplierGroupDTO supplierGroupDTO);
    SupplierGroupDTO updateSupplierGroup(int id, SupplierGroupDTO supplierGroupDTO);
    void deleteSupplierGroup(int id);
}
