package com.springboot.store.repository;

import com.springboot.store.entity.ReturnInvoice;
import jakarta.persistence.TemporalType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Temporal;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ReturnInvoiceRepository extends JpaRepository<ReturnInvoice, Integer> {
    List<ReturnInvoice> findByStoreId(int storeId);

    @Query("SELECT s FROM ReturnInvoice s WHERE s.store.id = :storeId AND DATE(s.createdAt) = :date")
    List<ReturnInvoice> findByStoreIdAndDate(@Param("storeId") Integer storeId, @Param("date") @Temporal(TemporalType.DATE) Date date);

    @Query("SELECT i FROM ReturnInvoice i WHERE i.store.id=:storeId AND i.createdAt BETWEEN :startDate AND :endDate")
    List<ReturnInvoice> findByCreatedAtBetween(@Param("startDate") @Temporal(TemporalType.DATE) Date startDate, @Param("endDate") @Temporal(TemporalType.DATE) Date endDate, @Param("storeId") Integer storeId);
}
