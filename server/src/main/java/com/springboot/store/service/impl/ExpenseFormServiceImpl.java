package com.springboot.store.service.impl;

import com.springboot.store.entity.ExpenseForm;
import com.springboot.store.entity.Staff;
import com.springboot.store.payload.ExpenseFormDTO;
import com.springboot.store.repository.*;
import com.springboot.store.service.ExpenseFormService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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
                    expenseFormDTO.setPayerName(staffRepository.findById(expenseFormDTO.getIdPayer()).orElseThrow().getName());
            case "Customer" ->
                    expenseFormDTO.setPayerName(customerRepository.findById(expenseFormDTO.getIdPayer()).orElseThrow().getName());
            case "Stranger" ->
                    expenseFormDTO.setPayerName(strangerRepository.findById(expenseFormDTO.getIdPayer()).orElseThrow().getName());
            case "Supplier" ->
                    expenseFormDTO.setPayerName(supplierRepository.findById(expenseFormDTO.getIdPayer()).orElseThrow().getName());
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
                        expenseFormDTO.setPayerName(staffRepository.findById(expenseFormDTO.getIdPayer()).orElseThrow().getName());
                case "Customer" ->
                        expenseFormDTO.setPayerName(customerRepository.findById(expenseFormDTO.getIdPayer()).orElseThrow().getName());
                case "Stranger" ->
                        expenseFormDTO.setPayerName(strangerRepository.findById(expenseFormDTO.getIdPayer()).orElseThrow().getName());
                case "Supplier" ->
                        expenseFormDTO.setPayerName(supplierRepository.findById(expenseFormDTO.getIdPayer()).orElseThrow().getName());
            }
            expenseFormDTOList.add(expenseFormDTO);
        }
        return expenseFormDTOList;
    }

    @Override
    public ExpenseFormDTO updateExpenseForm(int id, ExpenseFormDTO expenseFormDTO) {
        ExpenseForm existingExpenseForm = expenseFormRepository.findById(id).orElseThrow();
        existingExpenseForm.setExpenseType(expenseFormDTO.getExpenseType());
        existingExpenseForm.setReceiverType(expenseFormDTO.getReceiverType());
        existingExpenseForm.setNote(expenseFormDTO.getNote());
        existingExpenseForm.setValue(expenseFormDTO.getValue());
        existingExpenseForm.setIdPayer(expenseFormDTO.getIdPayer());
        expenseFormRepository.save(existingExpenseForm);
        expenseFormDTO = modelMapper.map(existingExpenseForm, ExpenseFormDTO.class);
        expenseFormDTO.setCreatorName(existingExpenseForm.getCreator().getName());
        switch (expenseFormDTO.getReceiverType()) {
            case "Staff" ->
                    expenseFormDTO.setPayerName(staffRepository.findById(expenseFormDTO.getIdPayer()).orElseThrow().getName());
            case "Customer" ->
                    expenseFormDTO.setPayerName(customerRepository.findById(expenseFormDTO.getIdPayer()).orElseThrow().getName());
            case "Stranger" ->
                    expenseFormDTO.setPayerName(strangerRepository.findById(expenseFormDTO.getIdPayer()).orElseThrow().getName());
            case "Supplier" ->
                    expenseFormDTO.setPayerName(supplierRepository.findById(expenseFormDTO.getIdPayer()).orElseThrow().getName());
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
                .idPayer(expenseFormDTO.getIdPayer())
                .build();
        Staff staff = staffService.getAuthorizedStaff();
        expenseForm.setCreator(staff);
        expenseForm.setStore(staff.getStore());
        expenseForm.setCreatedDate(new Date());
        expenseFormRepository.save(expenseForm);
        expenseFormDTO = modelMapper.map(expenseForm, ExpenseFormDTO.class);
        expenseFormDTO.setCreatorName(expenseForm.getCreator().getName());
        switch (expenseFormDTO.getReceiverType()) {
            case "Staff" ->
                    expenseFormDTO.setPayerName(staffRepository.findById(expenseFormDTO.getIdPayer()).orElseThrow().getName());
            case "Customer" ->
                    expenseFormDTO.setPayerName(customerRepository.findById(expenseFormDTO.getIdPayer()).orElseThrow().getName());
            case "Stranger" ->
                    expenseFormDTO.setPayerName(strangerRepository.findById(expenseFormDTO.getIdPayer()).orElseThrow().getName());
            case "Supplier" ->
                    expenseFormDTO.setPayerName(supplierRepository.findById(expenseFormDTO.getIdPayer()).orElseThrow().getName());
        }
        return expenseFormDTO;
    }

    @Override
    public void deleteExpenseForm(int id) {
        expenseFormRepository.deleteById(id);
    }
}
