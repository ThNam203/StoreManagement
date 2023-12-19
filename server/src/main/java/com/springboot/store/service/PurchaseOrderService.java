package com.springboot.store.service;

import com.springboot.store.payload.PurchaseOrderDTO;

import java.util.List;

public interface PurchaseOrderService {
    PurchaseOrderDTO getPurchaseOrder(int id);
    List<PurchaseOrderDTO> getPurchaseOrders();
    PurchaseOrderDTO createPurchaseOrder(PurchaseOrderDTO purchaseOrderDTO);
    PurchaseOrderDTO updatePurchaseOrder(int id, PurchaseOrderDTO purchaseOrderDTO);
    void deletePurchaseOrder(int id);
}
