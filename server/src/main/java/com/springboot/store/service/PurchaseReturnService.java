package com.springboot.store.service;

import com.springboot.store.payload.PurchaseReturnDTO;

import java.util.List;

public interface PurchaseReturnService {
    PurchaseReturnDTO getPurchaseReturnById(int id);
    List<PurchaseReturnDTO> getAllPurchaseReturns();
    PurchaseReturnDTO createPurchaseReturn(PurchaseReturnDTO purchaseReturnDTO);
    PurchaseReturnDTO updatePurchaseReturn(int id, PurchaseReturnDTO purchaseReturnDTO);
    void deletePurchaseReturn(int id);
}
