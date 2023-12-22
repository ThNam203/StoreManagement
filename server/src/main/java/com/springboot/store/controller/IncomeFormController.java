package com.springboot.store.controller;

import com.springboot.store.payload.IncomeFormDTO;
import com.springboot.store.service.IncomeFormService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
@RequiredArgsConstructor
public class IncomeFormController {
    private final IncomeFormService incomeFormService;

    @GetMapping
    public ResponseEntity<List<IncomeFormDTO>> getAllIncomeForms() {
        List<IncomeFormDTO> incomeForms = incomeFormService.getAllIncomeForm();
        return ResponseEntity.ok(incomeForms);
    }

    @GetMapping("/{incomeFormId}")
    public ResponseEntity<IncomeFormDTO> getIncomeFormById(@PathVariable int incomeFormId) {
        IncomeFormDTO incomeFormDTO = incomeFormService.getIncomeFormById(incomeFormId);
        return ResponseEntity.ok(incomeFormDTO);
    }

    @PostMapping
    public ResponseEntity<IncomeFormDTO> createIncomeForm(@RequestBody IncomeFormDTO incomeFormDTO) {
        IncomeFormDTO createdIncomeForm = incomeFormService.createIncomeForm(incomeFormDTO);
        return ResponseEntity.ok(createdIncomeForm);
    }

    @PutMapping("/{incomeFormId}")
    public ResponseEntity<IncomeFormDTO> updateIncomeForm(@PathVariable int incomeFormId, @RequestBody IncomeFormDTO incomeFormDTO) {
        IncomeFormDTO updatedIncomeForm = incomeFormService.updateIncomeForm(incomeFormId, incomeFormDTO);
        return ResponseEntity.ok(updatedIncomeForm);
    }

    @DeleteMapping("/{incomeFormId}")
    public ResponseEntity<Void> deleteIncomeForm(@PathVariable int incomeFormId) {
        incomeFormService.deleteIncomeForm(incomeFormId);
        return ResponseEntity.ok().build();
    }

}
