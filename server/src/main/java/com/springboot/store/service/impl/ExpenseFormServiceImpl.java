package com.springboot.store.service.impl;

import com.springboot.store.entity.ExpenseForm;
import com.springboot.store.entity.Staff;
import com.springboot.store.exception.CustomException;
import com.springboot.store.payload.ExpenseFormDTO;
import com.springboot.store.repository.*;
import com.springboot.store.service.ExpenseFormService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseFormServiceImpl implements ExpenseFormService {
    private final ExpenseFormRepository expenseFormRepository;
    private final StaffRepository staffRepository;
    private final StrangerRepository strangerRepository;
    private final SupplierRepository supplierRepository;
    private final CustomerRepository customerRepository;
    private final StaffService staffService;
    private final ModelMapper modelMapper;

    @Override
    public ExpenseFormDTO getExpenseFormById(int id) {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        ExpenseForm expenseForm = expenseFormRepository.findByIdAndStoreId(id, storeId).orElseThrow();
        ExpenseFormDTO expenseFormDTO = modelMapper.map(expenseForm, ExpenseFormDTO.class);
        expenseFormDTO.setCreatorName(expenseForm.getCreator().getName());
        switch (expenseFormDTO.getReceiverType()) {
            case "Staff" ->
                    expenseFormDTO.setReceiverName(staffRepository.findById(expenseFormDTO.getIdReceiver()).orElseThrow().getName());
            case "Customer" -> {
                if (expenseFormDTO.getIdReceiver() == -1)
                    expenseFormDTO.setReceiverName("Retail Customer");
                else
                    expenseFormDTO.setReceiverName(customerRepository.findById(expenseFormDTO.getIdReceiver()).orElseThrow().getName());
            }
            case "Other" ->
                    expenseFormDTO.setReceiverName(strangerRepository.findById(expenseFormDTO.getIdReceiver()).orElseThrow().getName());
            case "Supplier" ->
                    expenseFormDTO.setReceiverName(supplierRepository.findById(expenseFormDTO.getIdReceiver()).orElseThrow().getName());
        }
        return expenseFormDTO;
    }

    @Override
    public List<ExpenseFormDTO> getAllExpenseForm() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<ExpenseForm> expenseForms = expenseFormRepository.findByStoreId(storeId);
        List<ExpenseFormDTO> expenseFormDTOList = new ArrayList<>();
        for (ExpenseForm expenseForm : expenseForms) {
            ExpenseFormDTO expenseFormDTO = modelMapper.map(expenseForm, ExpenseFormDTO.class);
            expenseFormDTO.setCreatorName(expenseForm.getCreator().getName());
            switch (expenseFormDTO.getReceiverType()) {
                case "Staff" ->
                        expenseFormDTO.setReceiverName(staffRepository.findById(expenseFormDTO.getIdReceiver()).orElseThrow().getName());
                case "Customer" -> {
                    if (expenseFormDTO.getIdReceiver() == -1)
                        expenseFormDTO.setReceiverName("Retail Customer");
                    else
                        expenseFormDTO.setReceiverName(customerRepository.findById(expenseFormDTO.getIdReceiver()).orElseThrow().getName());
                }
                case "Other" ->
                        expenseFormDTO.setReceiverName(strangerRepository.findById(expenseFormDTO.getIdReceiver()).orElseThrow().getName());
                case "Supplier" ->
                        expenseFormDTO.setReceiverName(supplierRepository.findById(expenseFormDTO.getIdReceiver()).orElseThrow().getName());
            }
            expenseFormDTOList.add(expenseFormDTO);
        }
        return expenseFormDTOList;
    }

    @Override
    public ExpenseFormDTO updateExpenseForm(int id, ExpenseFormDTO expenseFormDTO) {
        ExpenseForm existingExpenseForm = expenseFormRepository.findById(id).orElseThrow(() ->
                new CustomException("Expense form not found", HttpStatus.NOT_FOUND));
        existingExpenseForm.setExpenseType(expenseFormDTO.getExpenseType());
        existingExpenseForm.setReceiverType(expenseFormDTO.getReceiverType());
        existingExpenseForm.setNote(expenseFormDTO.getNote());
        existingExpenseForm.setValue(expenseFormDTO.getValue());
        existingExpenseForm.setIdReceiver(expenseFormDTO.getIdReceiver());
        existingExpenseForm.setDate(expenseFormDTO.getDate());
        existingExpenseForm.setDescription(expenseFormDTO.getDescription());
        expenseFormRepository.save(existingExpenseForm);
        expenseFormDTO = modelMapper.map(existingExpenseForm, ExpenseFormDTO.class);
        expenseFormDTO.setCreatorName(existingExpenseForm.getCreator().getName());
        switch (expenseFormDTO.getReceiverType()) {
            case "Staff" ->
                    expenseFormDTO.setReceiverName(staffRepository.findById(expenseFormDTO.getIdReceiver()).orElseThrow().getName());
            case "Customer" -> {
                if (expenseFormDTO.getIdReceiver() == -1)
                    expenseFormDTO.setReceiverName("Retail Customer");
                else
                    expenseFormDTO.setReceiverName(customerRepository.findById(expenseFormDTO.getIdReceiver()).orElseThrow().getName());
            }
            case "Other" ->
                    expenseFormDTO.setReceiverName(strangerRepository.findById(expenseFormDTO.getIdReceiver()).orElseThrow().getName());
            case "Supplier" ->
                    expenseFormDTO.setReceiverName(supplierRepository.findById(expenseFormDTO.getIdReceiver()).orElseThrow().getName());
        }
        return expenseFormDTO;
    }

    @Override
    public ExpenseFormDTO createExpenseForm(ExpenseFormDTO expenseFormDTO) {
        ExpenseForm expenseForm = ExpenseForm.builder()
                .note(expenseFormDTO.getNote())
                .value(expenseFormDTO.getValue())
                .receiverType(expenseFormDTO.getReceiverType())
                .expenseType(expenseFormDTO.getExpenseType())
                .idReceiver(expenseFormDTO.getIdReceiver())
                .build();
        Staff staff = staffService.getAuthorizedStaff();
        expenseForm.setCreator(staff);
        expenseForm.setStore(staff.getStore());
        expenseForm.setDate(expenseFormDTO.getDate());
        expenseForm.setDescription(expenseFormDTO.getDescription());
        expenseForm.setLinkedFormId(expenseFormDTO.getLinkedFormId());
        expenseFormRepository.save(expenseForm);
        expenseFormDTO = modelMapper.map(expenseForm, ExpenseFormDTO.class);
        expenseFormDTO.setCreatorName(expenseForm.getCreator().getName());
        switch (expenseFormDTO.getReceiverType()) {
            case "Staff" ->
                    expenseFormDTO.setReceiverName(staffRepository.findById(expenseFormDTO.getIdReceiver()).orElseThrow().getName());
            case "Customer" -> {
                if (expenseFormDTO.getIdReceiver() == -1)
                    expenseFormDTO.setReceiverName("Retail Customer");
                else
                    expenseFormDTO.setReceiverName(customerRepository.findById(expenseFormDTO.getIdReceiver()).orElseThrow().getName());
            }
            case "Other" ->
                    expenseFormDTO.setReceiverName(strangerRepository.findById(expenseFormDTO.getIdReceiver()).orElseThrow().getName());
            case "Supplier" ->
                    expenseFormDTO.setReceiverName(supplierRepository.findById(expenseFormDTO.getIdReceiver()).orElseThrow().getName());
        }
        return expenseFormDTO;
    }

    @Override
    public void createExpenseForm(String receiverType, Date date, String expenseType, int value, int idReceiver, String note, String description, int linkedFormId) {
        ExpenseForm expenseForm = ExpenseForm.builder()
                .receiverType(receiverType)
                .date(date)
                .expenseType(expenseType)
                .value(value)
                .idReceiver(idReceiver)
                .note(note)
                .description(description)
                .linkedFormId(linkedFormId)
                .build();
        Staff staff = staffService.getAuthorizedStaff();
        expenseForm.setCreator(staff);
        expenseForm.setStore(staff.getStore());
        expenseFormRepository.save(expenseForm);
    }

    @Override
    public void deleteExpenseForm(int id) {
        ExpenseForm expenseForm = expenseFormRepository.findById(id).orElseThrow();
        if (expenseForm.getLinkedFormId() != -1) {
            throw new RuntimeException("This expense form cannot delete because it is linked to another form");
        }
        expenseFormRepository.deleteById(id);
    }
}
