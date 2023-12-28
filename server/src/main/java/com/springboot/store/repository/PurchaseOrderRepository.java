package com.springboot.store.repository;

import com.springboot.store.entity.PurchaseOrder;
import jakarta.persistence.TemporalType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Temporal;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {
    List<PurchaseOrder> findByStoreId(int storeId);

    @Query("SELECT i FROM PurchaseOrder i WHERE i.store.id=:storeId AND i.createdDate BETWEEN :startDate AND :endDate")
    List<PurchaseOrder> findByStoreIdAndCreatedDateBetween(@Param("startDate") @Temporal(TemporalType.DATE) Date startDate, @Param("endDate") @Temporal(TemporalType.DATE) Date endDate, @Param("storeId") Integer storeId);
}
