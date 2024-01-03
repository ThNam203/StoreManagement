package com.springboot.store.service;

import com.springboot.store.payload.SupplierDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SupplierService {
    List<SupplierDTO> getAllSuppliers();
    SupplierDTO getSupplierById(int id);
    SupplierDTO createSupplier(SupplierDTO supplierDTO);
    SupplierDTO updateSupplier(int id, SupplierDTO supplierDTO);
    void deleteSupplier(int id);
}
