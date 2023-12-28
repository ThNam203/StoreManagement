package com.springboot.store.service.impl;

import com.springboot.store.entity.PurchaseOrder;
import com.springboot.store.entity.PurchaseReturn;
import com.springboot.store.payload.report.PurchaseOrderOfSupplierDTO;
import com.springboot.store.payload.report.PurchaseReturnOfSupplierDTO;
import com.springboot.store.payload.report.RecordOfSupplierDTO;
import com.springboot.store.repository.PurchaseOrderRepository;
import com.springboot.store.repository.PurchaseReturnRepository;
import com.springboot.store.service.RecordOfSupplierService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RecordOfSupplierServiceImpl implements RecordOfSupplierService {
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseReturnRepository purchaseReturnRepository;
    private final StaffService staffService;

    @Override
    public List<RecordOfSupplierDTO> getAllRecordOfSupplier(Date startDate, Date endDate) {
        int id = staffService.getAuthorizedStaff().getStore().getId();
        List<PurchaseOrder> purchaseOrders = purchaseOrderRepository.findByStoreIdAndCreatedDateBetween(startDate, endDate, id);
        List<PurchaseReturn> purchaseReturns = purchaseReturnRepository.findByStoreIdAndCreatedDateBetween(startDate, endDate, id);
        Map<Integer, RecordOfSupplierDTO> recordOfSupplierDTOMap = new HashMap<>();
        for (PurchaseOrder purchaseOrder : purchaseOrders) {
            RecordOfSupplierDTO recordOfSupplierDTO = recordOfSupplierDTOMap.computeIfAbsent(purchaseOrder.getSupplier().getId(), id1 -> createNewRecordOfSupplierDTO(id1, purchaseOrder));
            updateRecordOfSupplierDTOForPurchaseOrder(recordOfSupplierDTO, purchaseOrder);
        }
        for (PurchaseReturn purchaseReturn : purchaseReturns) {
            RecordOfSupplierDTO recordOfSupplierDTO = recordOfSupplierDTOMap.computeIfAbsent(purchaseReturn.getSupplier().getId(), id1 -> createNewRecordOfSupplierDTOFromPurchaseReturn(id1, purchaseReturn));
            updateRecordOfSupplierDTOForPurchaseReturn(recordOfSupplierDTO, purchaseReturn);
        }
        return new ArrayList<>(recordOfSupplierDTOMap.values());
    }

    public RecordOfSupplierDTO createNewRecordOfSupplierDTO(int supplierId, PurchaseOrder purchaseOrder) {
        return new RecordOfSupplierDTO(supplierId, purchaseOrder.getSupplier().getName(), 0, 0, 0, 0, new ArrayList<>(), new ArrayList<>());
    }

    public RecordOfSupplierDTO createNewRecordOfSupplierDTOFromPurchaseReturn(int supplierId, PurchaseReturn purchaseReturn) {
        return new RecordOfSupplierDTO(supplierId, purchaseReturn.getSupplier().getName(), 0, 0, 0, 0, new ArrayList<>(), new ArrayList<>());
    }

    public void updateRecordOfSupplierDTOForPurchaseOrder(RecordOfSupplierDTO recordOfSupplierDTO, PurchaseOrder purchaseOrder) {
        recordOfSupplierDTO.setTotalOfProduct(recordOfSupplierDTO.getTotalOfProduct() + purchaseOrder.getSubtotal());
        recordOfSupplierDTO.setDiscount(recordOfSupplierDTO.getDiscount() + purchaseOrder.getDiscount());
        recordOfSupplierDTO.setTotalPay(recordOfSupplierDTO.getTotalOfProduct() - recordOfSupplierDTO.getDiscount());
        recordOfSupplierDTO.getPurchaseOrders().add(new PurchaseOrderOfSupplierDTO(purchaseOrder.getId(), purchaseOrder.getCreatedDate(), purchaseOrder.getStaff().getName(), purchaseOrder.getSubtotal(), purchaseOrder.getDiscount(), purchaseOrder.getTotal()));
    }

    public void updateRecordOfSupplierDTOForPurchaseReturn(RecordOfSupplierDTO recordOfSupplierDTO, PurchaseReturn purchaseReturn) {
        recordOfSupplierDTO.setTotalReturn(recordOfSupplierDTO.getTotalReturn() + purchaseReturn.getTotal());
        recordOfSupplierDTO.getPurchaseReturns().add(new PurchaseReturnOfSupplierDTO(purchaseReturn.getId(), purchaseReturn.getCreatedDate(), purchaseReturn.getStaff().getName(), purchaseReturn.getSubtotal(), purchaseReturn.getDiscount(), purchaseReturn.getTotal()));
    }
}
