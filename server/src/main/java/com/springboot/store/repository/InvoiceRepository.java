package com.springboot.store.repository;

import com.springboot.store.entity.Invoice;
import jakarta.persistence.TemporalType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Temporal;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    List<Invoice> findByStoreId(Integer storeId);

    @Query("SELECT s FROM Invoice s WHERE s.store.id = :storeId AND DATE(s.createdAt) = :date")
    List<Invoice> findByStoreIdAndDate(@Param("storeId") Integer storeId, @Param("date") @Temporal(TemporalType.DATE) Date date);
}
