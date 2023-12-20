package com.springboot.store.service.impl;

import com.springboot.store.entity.PurchaseOrder;
import com.springboot.store.entity.PurchaseOrderDetail;
import com.springboot.store.exception.CustomException;
import com.springboot.store.mapper.PurchaseOrderDetailMapper;
import com.springboot.store.mapper.PurchaseOrderMapper;
import com.springboot.store.payload.PurchaseOrderDTO;
import com.springboot.store.repository.ProductRepository;
import com.springboot.store.repository.PurchaseOrderRepository;
import com.springboot.store.repository.StaffRepository;
import com.springboot.store.repository.SupplierRepository;
import com.springboot.store.service.PurchaseOrderService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseOrderServiceImpl implements PurchaseOrderService {
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final StaffService staffService;
    private final StaffRepository staffRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;

    @Override
    public PurchaseOrderDTO getPurchaseOrder(int id) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id).orElseThrow(() -> new CustomException("Purchase order not found", HttpStatus.NOT_FOUND));
        return PurchaseOrderMapper.toPurchaseOrderDTO(purchaseOrder);
    }

    @Override
    public List<PurchaseOrderDTO> getPurchaseOrders() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<PurchaseOrder> purchaseOrders = purchaseOrderRepository.findByStoreId(storeId);
        return purchaseOrders.stream().map(PurchaseOrderMapper::toPurchaseOrderDTO).toList();
    }

    @Override
    public PurchaseOrderDTO createPurchaseOrder(PurchaseOrderDTO purchaseOrderDTO) {
        PurchaseOrder purchaseOrder = PurchaseOrderMapper.toPurchaseOrder(purchaseOrderDTO);
        purchaseOrder.setStore(staffService.getAuthorizedStaff().getStore());
        if (purchaseOrderDTO.getStaffId() != null) {
            purchaseOrder.setStaff(staffRepository.findById(purchaseOrderDTO.getStaffId()).orElseThrow(() -> new CustomException("Staff not found", HttpStatus.NOT_FOUND)));
        }
        if (purchaseOrderDTO.getSupplierId() != null) {
            purchaseOrder.setSupplier(supplierRepository.findById(purchaseOrderDTO.getSupplierId()).orElseThrow(() -> new CustomException("Supplier not found", HttpStatus.NOT_FOUND)));
        }
        if (purchaseOrderDTO.getPurchaseOrderDetail() != null) {
            List<PurchaseOrderDetail> purchaseOrderDetails = purchaseOrderDTO.getPurchaseOrderDetail().stream().map(purchaseOrderDetailDTO -> {
                PurchaseOrderDetail purchaseOrderDetail = PurchaseOrderDetailMapper.toPurchaseOrderDetail(purchaseOrderDetailDTO);
                purchaseOrderDetail.setPurchaseOrder(purchaseOrder);
                purchaseOrderDetail.setProduct(productRepository.findById(purchaseOrderDetailDTO.getProductId()).orElseThrow(() -> new CustomException("Product not found", HttpStatus.NOT_FOUND)));
                return purchaseOrderDetail;
            }).toList();
            purchaseOrder.setPurchaseOrderDetail(purchaseOrderDetails);
        }

        return PurchaseOrderMapper.toPurchaseOrderDTO(purchaseOrderRepository.save(purchaseOrder));
    }

    @Override
    public PurchaseOrderDTO updatePurchaseOrder(int id, PurchaseOrderDTO purchaseOrderDTO) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id).orElseThrow(() -> new CustomException("Purchase order not found", HttpStatus.NOT_FOUND));
        purchaseOrder.setSubtotal(purchaseOrderDTO.getSubtotal());
        purchaseOrder.setDiscount(purchaseOrderDTO.getDiscount());
        purchaseOrder.setTotal(purchaseOrderDTO.getTotal());
        purchaseOrder.setNote(purchaseOrderDTO.getNote());
        purchaseOrder.setPaymentMethod(purchaseOrderDTO.getPaymentMethod());
        purchaseOrder.setCreatedDate(purchaseOrderDTO.getCreatedDate());

        if (purchaseOrderDTO.getStaffId() != null) {
            purchaseOrder.setStaff(staffRepository.findById(purchaseOrderDTO.getStaffId()).orElseThrow(() -> new CustomException("Staff not found", HttpStatus.NOT_FOUND)));
        }

        if (purchaseOrderDTO.getSupplierId() != null) {
            purchaseOrder.setSupplier(supplierRepository.findById(purchaseOrderDTO.getSupplierId()).orElseThrow(() -> new CustomException("Supplier not found", HttpStatus.NOT_FOUND)));
        }

        if (purchaseOrderDTO.getPurchaseOrderDetail() != null) {
            List<PurchaseOrderDetail> purchaseOrderDetails = purchaseOrderDTO.getPurchaseOrderDetail().stream().map(purchaseOrderDetailDTO -> {
                PurchaseOrderDetail purchaseOrderDetail = PurchaseOrderDetailMapper.toPurchaseOrderDetail(purchaseOrderDetailDTO);
                purchaseOrderDetail.setPurchaseOrder(purchaseOrder);
                purchaseOrderDetail.setProduct(productRepository.findById(purchaseOrderDetailDTO.getProductId()).orElseThrow(() -> new CustomException("Product not found", HttpStatus.NOT_FOUND)));
                return purchaseOrderDetail;
            }).toList();
            purchaseOrder.getPurchaseOrderDetail().clear();
            purchaseOrder.getPurchaseOrderDetail().addAll(purchaseOrderDetails);
        }

        return PurchaseOrderMapper.toPurchaseOrderDTO(purchaseOrderRepository.save(purchaseOrder));
    }

    @Override
    public void deletePurchaseOrder(int id) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id).orElseThrow(() -> new CustomException("Purchase order not found", HttpStatus.NOT_FOUND));
        purchaseOrderRepository.delete(purchaseOrder);
    }
}
