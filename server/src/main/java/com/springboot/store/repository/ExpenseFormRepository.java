package com.springboot.store.repository;


import com.springboot.store.entity.ExpenseForm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExpenseFormRepository extends JpaRepository<ExpenseForm, Integer> {
    List<ExpenseForm> findByStoreId(Integer id);

    Optional<ExpenseForm> findByIdAndStoreId(int id, int storeId);
}
