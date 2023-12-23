package com.springboot.store.service;

import com.springboot.store.payload.IncomeFormDTO;

import java.util.Date;
import java.util.List;

public interface IncomeFormService {
    IncomeFormDTO getIncomeFormById(int id);

    List<IncomeFormDTO> getAllIncomeForm();

    IncomeFormDTO updateIncomeForm(int id, IncomeFormDTO incomeFormDTO);

    IncomeFormDTO createIncomeForm(IncomeFormDTO incomeFormDTO);

    void deleteIncomeForm(int id);

    void createIncomeForm(String payerType, Date date, String incomeType, int value, int idPayer, String note, String description, int linkedFormId);
}
