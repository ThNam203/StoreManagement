package com.springboot.store.service.impl;

import com.springboot.store.entity.IncomeForm;
import com.springboot.store.entity.Staff;
import com.springboot.store.exception.CustomException;
import com.springboot.store.payload.IncomeFormDTO;
import com.springboot.store.repository.*;
import com.springboot.store.service.IncomeFormService;
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
public class IncomeFormServiceImpl implements IncomeFormService {
    private final IncomeFormRepository incomeFormRepository;
    private final StaffRepository staffRepository;
    private final StrangerRepository strangerRepository;
    private final SupplierRepository supplierRepository;
    private final CustomerRepository customerRepository;
    private final StaffService staffService;
    private final ModelMapper modelMapper;

    @Override
    public IncomeFormDTO getIncomeFormById(int id) {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        IncomeForm incomeForm = incomeFormRepository.findByIdAndStoreId(id, storeId).orElseThrow();
        IncomeFormDTO incomeFormDTO = modelMapper.map(incomeForm, IncomeFormDTO.class);
        incomeFormDTO.setCreatorName(incomeForm.getCreator().getName());
        switch (incomeFormDTO.getPayerType()) {
            case "Staff" ->
                    incomeFormDTO.setPayerName(staffRepository.findById(incomeFormDTO.getIdPayer()).orElseThrow().getName());
            case "Customer" -> {
                if (incomeFormDTO.getIdPayer() == -1)
                    incomeFormDTO.setPayerName("Retail Customer");
                else
                    incomeFormDTO.setPayerName(customerRepository.findById(incomeFormDTO.getIdPayer()).orElseThrow().getName());
            }
            case "Other" ->
                    incomeFormDTO.setPayerName(strangerRepository.findById(incomeFormDTO.getIdPayer()).orElseThrow().getName());
            case "Supplier" ->
                    incomeFormDTO.setPayerName(supplierRepository.findById(incomeFormDTO.getIdPayer()).orElseThrow().getName());
        }
        return incomeFormDTO;
    }

    @Override
    public List<IncomeFormDTO> getAllIncomeForm() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<IncomeForm> incomeForms = incomeFormRepository.findByStoreId(storeId);
        List<IncomeFormDTO> incomeFormDTOList = new ArrayList<>();
        for (IncomeForm incomeForm : incomeForms) {
            IncomeFormDTO incomeFormDTO = modelMapper.map(incomeForm, IncomeFormDTO.class);
            incomeFormDTO.setCreatorName(incomeForm.getCreator().getName());
            switch (incomeFormDTO.getPayerType()) {
                case "Staff" ->
                        incomeFormDTO.setPayerName(staffRepository.findById(incomeFormDTO.getIdPayer()).orElseThrow().getName());
                case "Customer" -> {
                    if (incomeFormDTO.getIdPayer() == -1)
                        incomeFormDTO.setPayerName("Retail Customer");
                    else
                        incomeFormDTO.setPayerName(customerRepository.findById(incomeFormDTO.getIdPayer()).orElseThrow().getName());
                }
                case "Other" ->
                        incomeFormDTO.setPayerName(strangerRepository.findById(incomeFormDTO.getIdPayer()).orElseThrow().getName());
                case "Supplier" ->
                        incomeFormDTO.setPayerName(supplierRepository.findById(incomeFormDTO.getIdPayer()).orElseThrow().getName());
            }
            incomeFormDTOList.add(incomeFormDTO);
        }
        return incomeFormDTOList;
    }

    @Override
    public IncomeFormDTO updateIncomeForm(int id, IncomeFormDTO incomeFormDTO) {
        IncomeForm existingIncomeForm = incomeFormRepository.findById(id).orElseThrow(() ->
                new CustomException("Income form not found", HttpStatus.NOT_FOUND));
        existingIncomeForm.setPayerType(incomeFormDTO.getPayerType());
        existingIncomeForm.setDate(incomeFormDTO.getDate());
        existingIncomeForm.setIncomeType(incomeFormDTO.getIncomeType());
        existingIncomeForm.setValue(incomeFormDTO.getValue());
        existingIncomeForm.setIdPayer(incomeFormDTO.getIdPayer());
        existingIncomeForm.setNote(incomeFormDTO.getNote());
        existingIncomeForm.setDescription(incomeFormDTO.getDescription());
        incomeFormRepository.save(existingIncomeForm);
        incomeFormDTO = modelMapper.map(existingIncomeForm, IncomeFormDTO.class);
        incomeFormDTO.setCreatorName(existingIncomeForm.getCreator().getName());
        switch (incomeFormDTO.getPayerType()) {
            case "Staff" ->
                    incomeFormDTO.setPayerName(staffRepository.findById(incomeFormDTO.getIdPayer()).orElseThrow().getName());
            case "Customer" -> {
                if (incomeFormDTO.getIdPayer() == -1)
                    incomeFormDTO.setPayerName("Retail Customer");
                else
                    incomeFormDTO.setPayerName(customerRepository.findById(incomeFormDTO.getIdPayer()).orElseThrow().getName());
            }
            case "Other" ->
                    incomeFormDTO.setPayerName(strangerRepository.findById(incomeFormDTO.getIdPayer()).orElseThrow().getName());
            case "Supplier" ->
                    incomeFormDTO.setPayerName(supplierRepository.findById(incomeFormDTO.getIdPayer()).orElseThrow().getName());
        }
        return incomeFormDTO;
    }

    @Override
    public IncomeFormDTO createIncomeForm(IncomeFormDTO incomeFormDTO) {
        IncomeForm incomeForm = IncomeForm.builder()
                .note(incomeFormDTO.getNote())
                .description(incomeFormDTO.getDescription())
                .date(incomeFormDTO.getDate())
                .idPayer(incomeFormDTO.getIdPayer())
                .incomeType(incomeFormDTO.getIncomeType())
                .payerType(incomeFormDTO.getPayerType())
                .value(incomeFormDTO.getValue())
                .linkedFormId(incomeFormDTO.getLinkedFormId())
                .build();
        incomeForm.setCreator(staffService.getAuthorizedStaff());
        incomeForm.setStore(staffService.getAuthorizedStaff().getStore());
        incomeFormRepository.save(incomeForm);
        incomeFormDTO = modelMapper.map(incomeForm, IncomeFormDTO.class);
        incomeFormDTO.setCreatorName(incomeForm.getCreator().getName());
        switch (incomeFormDTO.getPayerType()) {
            case "Staff" ->
                    incomeFormDTO.setPayerName(staffRepository.findById(incomeFormDTO.getIdPayer()).orElseThrow().getName());
            case "Customer" -> {
                if (incomeFormDTO.getIdPayer() == -1)
                    incomeFormDTO.setPayerName("Retail Customer");
                else
                    incomeFormDTO.setPayerName(customerRepository.findById(incomeFormDTO.getIdPayer()).orElseThrow().getName());
            }
            case "Other" ->
                    incomeFormDTO.setPayerName(strangerRepository.findById(incomeFormDTO.getIdPayer()).orElseThrow().getName());
            case "Supplier" ->
                    incomeFormDTO.setPayerName(supplierRepository.findById(incomeFormDTO.getIdPayer()).orElseThrow().getName());
        }
        return incomeFormDTO;
    }

    @Override
    public void deleteIncomeForm(int id) {
        IncomeForm incomeForm = incomeFormRepository.findById(id).orElseThrow(() ->
                new CustomException("Income form not found", HttpStatus.NOT_FOUND));
        if (incomeForm.getLinkedFormId() != -1) {
            throw new CustomException("This income form cannot delete because it is linked to another form", HttpStatus.BAD_REQUEST);
        }
        incomeFormRepository.delete(incomeForm);
    }

    @Override
    public void createIncomeForm(String payerType, Date date, String incomeType, int value, int idPayer, String note, String description, int linkedFormId) {
        IncomeForm incomeForm = IncomeForm.builder()
                .note(note)
                .description(description)
                .date(date)
                .idPayer(idPayer)
                .incomeType(incomeType)
                .payerType(payerType)
                .value(value)
                .linkedFormId(linkedFormId)
                .build();
        Staff staff = staffService.getAuthorizedStaff();
        incomeForm.setCreator(staff);
        incomeForm.setStore(staff.getStore());
        incomeFormRepository.save(incomeForm);
    }
}
