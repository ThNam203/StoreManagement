package com.springboot.store.controller;

import com.springboot.store.payload.ExpenseFormDTO;
import com.springboot.store.service.ExpenseFormService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseFormController {
    private final ExpenseFormService expenseFormService;

    @GetMapping
    public ResponseEntity<List<ExpenseFormDTO>> getAllExpenseForms() {
        List<ExpenseFormDTO> expenseForms = expenseFormService.getAllExpenseForm();
        return ResponseEntity.ok(expenseForms);
    }

    @GetMapping("/{expenseFormId}")
    public ResponseEntity<ExpenseFormDTO> getExpenseFormById(@PathVariable int expenseFormId) {
        ExpenseFormDTO expenseFormDTO = expenseFormService.getExpenseFormById(expenseFormId);
        return ResponseEntity.ok(expenseFormDTO);
    }

    @PostMapping
    public ResponseEntity<ExpenseFormDTO> createExpenseForm(@RequestBody ExpenseFormDTO expenseFormDTO) {
        ExpenseFormDTO createdExpenseForm = expenseFormService.createExpenseForm(expenseFormDTO);
        return ResponseEntity.ok(createdExpenseForm);
    }

    @PutMapping("/{expenseFormId}")
    public ResponseEntity<ExpenseFormDTO> updateExpenseForm(@PathVariable int expenseFormId, @RequestBody ExpenseFormDTO expenseFormDTO) {
        ExpenseFormDTO updatedExpenseForm = expenseFormService.updateExpenseForm(expenseFormId, expenseFormDTO);
        return ResponseEntity.ok(updatedExpenseForm);
    }
}
