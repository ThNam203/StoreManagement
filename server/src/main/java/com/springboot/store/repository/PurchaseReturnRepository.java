package com.springboot.store.repository;

import com.springboot.store.entity.PurchaseReturn;
import jakarta.persistence.TemporalType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Temporal;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface PurchaseReturnRepository extends JpaRepository<PurchaseReturn, Integer> {
    List<PurchaseReturn> findByStoreId(int storeId);

    @Query("SELECT i FROM PurchaseReturn i WHERE i.store.id=:storeId AND i.createdDate BETWEEN :startDate AND :endDate")
    List<PurchaseReturn> findByStoreIdAndCreatedDateBetween(@Param("startDate") @Temporal(TemporalType.DATE) Date startDate, @Param("endDate") @Temporal(TemporalType.DATE) Date endDate, @Param("storeId") Integer storeId);
}
