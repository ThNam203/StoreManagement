package com.springboot.store.repository;

import com.springboot.store.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    List<Invoice> findByStoreId(Integer storeId);
}
