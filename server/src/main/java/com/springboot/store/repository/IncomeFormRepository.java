package com.springboot.store.repository;

import com.springboot.store.entity.IncomeForm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IncomeFormRepository extends JpaRepository<IncomeForm, Integer> {
    List<IncomeForm> findByStoreId(Integer id);

    Optional<IncomeForm> findByIdAndStoreId(int id, int storeId);
}
