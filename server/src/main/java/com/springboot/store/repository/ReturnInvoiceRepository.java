package com.springboot.store.repository;

import com.springboot.store.entity.ReturnInvoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReturnInvoiceRepository extends JpaRepository<ReturnInvoice, Integer> {
    List<ReturnInvoice> findByStoreId(int storeId);
}
