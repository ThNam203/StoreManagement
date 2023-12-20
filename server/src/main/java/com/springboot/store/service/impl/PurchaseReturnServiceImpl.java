package com.springboot.store.service.impl;

import com.springboot.store.entity.PurchaseReturn;
import com.springboot.store.entity.PurchaseReturnDetail;
import com.springboot.store.exception.CustomException;
import com.springboot.store.mapper.PurchaseReturnDetailMapper;
import com.springboot.store.mapper.PurchaseReturnMapper;
import com.springboot.store.payload.PurchaseReturnDTO;
import com.springboot.store.repository.*;
import com.springboot.store.service.PurchaseReturnService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseReturnServiceImpl implements PurchaseReturnService {
    private final PurchaseReturnRepository purchaseReturnRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final StaffService staffService;
    private final StaffRepository staffRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;

    @Override
    public PurchaseReturnDTO getPurchaseReturnById(int id) {
        PurchaseReturn purchaseReturn = purchaseReturnRepository.findById(id).orElseThrow(() -> new CustomException("Purchase return not found", HttpStatus.NOT_FOUND));
        return PurchaseReturnMapper.toPurchaseReturnDTO(purchaseReturn);
    }

    @Override
    public List<PurchaseReturnDTO> getAllPurchaseReturns() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<PurchaseReturn> purchaseReturns = purchaseReturnRepository.findByStoreId(storeId);
        return purchaseReturns.stream().map(PurchaseReturnMapper::toPurchaseReturnDTO).toList();
    }

    @Override
    public PurchaseReturnDTO createPurchaseReturn(PurchaseReturnDTO purchaseReturnDTO) {
        PurchaseReturn purchaseReturn = PurchaseReturnMapper.toPurchaseReturn(purchaseReturnDTO);
        purchaseReturn.setStore(staffService.getAuthorizedStaff().getStore());
        if (purchaseReturnDTO.getStaffId() != null) {
            purchaseReturn.setStaff(staffRepository.findById(purchaseReturnDTO.getStaffId()).orElseThrow(() -> new CustomException("Staff not found", HttpStatus.NOT_FOUND)));
        }
        if (purchaseReturnDTO.getSupplierId() != null) {
            purchaseReturn.setSupplier(supplierRepository.findById(purchaseReturnDTO.getSupplierId()).orElseThrow(() -> new CustomException("Supplier not found", HttpStatus.NOT_FOUND)));
        }
        if (purchaseReturnDTO.getPurchaseOrderId() != null) {
            purchaseReturn.setPurchaseOrder(purchaseOrderRepository.findById(purchaseReturnDTO.getPurchaseOrderId()).orElseThrow(() -> new CustomException("Purchase order not found", HttpStatus.NOT_FOUND)));
        }
        if (purchaseReturnDTO.getPurchaseReturnDetails() != null) {
            List<PurchaseReturnDetail> purchaseReturnDetails = purchaseReturnDTO.getPurchaseReturnDetails().stream().map(purchaseReturnDetailDTO -> {
                PurchaseReturnDetail purchaseReturnDetail = PurchaseReturnDetailMapper.toPurchaseReturnDetail(purchaseReturnDetailDTO);
                purchaseReturnDetail.setPurchaseReturn(purchaseReturn);
                purchaseReturnDetail.setProduct(productRepository.findById(purchaseReturnDetailDTO.getProductId()).orElseThrow(() -> new CustomException("Product not found", HttpStatus.NOT_FOUND)));
                return purchaseReturnDetail;
            }).toList();
            purchaseReturn.setPurchaseReturnDetails(purchaseReturnDetails);
        }
        return PurchaseReturnMapper.toPurchaseReturnDTO(purchaseReturnRepository.save(purchaseReturn));
    }

    @Override
    public PurchaseReturnDTO updatePurchaseReturn(int id, PurchaseReturnDTO purchaseReturnDTO) {
        PurchaseReturn purchaseReturn = purchaseReturnRepository.findById(id).orElseThrow(() -> new CustomException("Purchase return not found", HttpStatus.NOT_FOUND));
        purchaseReturn.setSubtotal(purchaseReturnDTO.getSubtotal());
        purchaseReturn.setDiscount(purchaseReturnDTO.getDiscount());
        purchaseReturn.setTotal(purchaseReturnDTO.getTotal());
        purchaseReturn.setNote(purchaseReturnDTO.getNote());
        purchaseReturn.setCreatedDate(purchaseReturnDTO.getCreatedDate());
        if (purchaseReturnDTO.getStaffId() != null) {
            purchaseReturn.setStaff(staffRepository.findById(purchaseReturnDTO.getStaffId()).orElseThrow(() -> new CustomException("Staff not found", HttpStatus.NOT_FOUND)));
        }
        if (purchaseReturnDTO.getSupplierId() != null) {
            purchaseReturn.setSupplier(supplierRepository.findById(purchaseReturnDTO.getSupplierId()).orElseThrow(() -> new CustomException("Supplier not found", HttpStatus.NOT_FOUND)));
        }
        if (purchaseReturnDTO.getPurchaseOrderId() != null) {
            purchaseReturn.setPurchaseOrder(purchaseOrderRepository.findById(purchaseReturnDTO.getPurchaseOrderId()).orElseThrow(() -> new CustomException("Purchase order not found", HttpStatus.NOT_FOUND)));
        }
        if (purchaseReturnDTO.getPurchaseReturnDetails() != null) {
            List<PurchaseReturnDetail> purchaseReturnDetails = purchaseReturnDTO.getPurchaseReturnDetails().stream().map(purchaseReturnDetailDTO -> {
                PurchaseReturnDetail purchaseReturnDetail = PurchaseReturnDetailMapper.toPurchaseReturnDetail(purchaseReturnDetailDTO);
                purchaseReturnDetail.setPurchaseReturn(purchaseReturn);
                purchaseReturnDetail.setProduct(productRepository.findById(purchaseReturnDetailDTO.getProductId()).orElseThrow(() -> new CustomException("Product not found", HttpStatus.NOT_FOUND)));
                return purchaseReturnDetail;
            }).toList();
            purchaseReturn.getPurchaseReturnDetails().clear();
            purchaseReturn.getPurchaseReturnDetails().addAll(purchaseReturnDetails);
        }
        return PurchaseReturnMapper.toPurchaseReturnDTO(purchaseReturnRepository.save(purchaseReturn));
    }

    @Override
    public void deletePurchaseReturn(int id) {
        PurchaseReturn purchaseReturn = purchaseReturnRepository.findById(id).orElseThrow(() -> new CustomException("Purchase return not found", HttpStatus.NOT_FOUND));
        purchaseReturnRepository.delete(purchaseReturn);
    }
}
