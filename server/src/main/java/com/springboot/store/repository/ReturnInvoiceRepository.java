package com.springboot.store.repository;

import com.springboot.store.entity.ReturnInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ReturnInvoiceRepository extends JpaRepository<ReturnInvoice, Integer> {
    List<ReturnInvoice> findByStoreId(int storeId);

    @Query("SELECT ri " +
            "FROM ReturnInvoice ri " +
            "WHERE ri.store.id = :storeId AND ri.createdAt BETWEEN :startDate AND :endDate " +
            "ORDER BY ri.createdAt ASC")
    List<ReturnInvoice> findByStoreIdAndCreatedAtBetween(
            @Param("storeId") Integer storeId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);

    @Query("SELECT ri.staff.id, SUM(ri.total) " +
            "FROM ReturnInvoice ri " +
            "WHERE ri.store.id = :storeId AND ri.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY ri.staff.id")
    List<Object[]> findSalesReportOfStaff(
            @Param("storeId") Integer storeId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);

}
