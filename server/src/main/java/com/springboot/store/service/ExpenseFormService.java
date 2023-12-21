package com.springboot.store.service;

import com.springboot.store.payload.ExpenseFormDTO;

import java.util.List;

public interface ExpenseFormService {
    ExpenseFormDTO getExpenseFormById(int id);

    List<ExpenseFormDTO> getAllExpenseForm();

    ExpenseFormDTO updateExpenseForm(int id, ExpenseFormDTO expenseFormDTO);

    ExpenseFormDTO createExpenseForm(ExpenseFormDTO expenseFormDTO);

    void deleteExpenseForm(int id);
}
