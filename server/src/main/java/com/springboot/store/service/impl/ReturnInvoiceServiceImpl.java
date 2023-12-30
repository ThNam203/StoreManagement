package com.springboot.store.service.impl;

import com.springboot.store.entity.Product;
import com.springboot.store.entity.ReturnDetail;
import com.springboot.store.entity.ReturnInvoice;
import com.springboot.store.entity.Staff;
import com.springboot.store.exception.CustomException;
import com.springboot.store.mapper.ReturnDetailMapper;
import com.springboot.store.mapper.ReturnInvoiceMapper;
import com.springboot.store.payload.ReturnInvoiceDTO;
import com.springboot.store.repository.CustomerRepository;
import com.springboot.store.repository.InvoiceRepository;
import com.springboot.store.repository.ProductRepository;
import com.springboot.store.repository.ReturnInvoiceRepository;
import com.springboot.store.service.ExpenseFormService;
import com.springboot.store.service.ReturnInvoiceService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReturnInvoiceServiceImpl implements ReturnInvoiceService {
    private final ReturnInvoiceRepository returnInvoiceRepository;
    private final CustomerRepository customerRepository;
    private final InvoiceRepository invoiceRepository;
    private final ProductRepository productRepository;
    private final ExpenseFormService expenseFormService;

    private final StaffService staffService;

    @Override
    public ReturnInvoiceDTO getReturnInvoiceById(int id) {
        ReturnInvoice returnInvoice = returnInvoiceRepository.findById(id).orElseThrow(() ->
                new CustomException("Return invoice not found", HttpStatus.NOT_FOUND));
        return ReturnInvoiceMapper.toReturnInvoiceDTO(returnInvoice);
    }

    @Override
    public List<ReturnInvoiceDTO> getAllReturnInvoices() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<ReturnInvoice> returnInvoices = returnInvoiceRepository.findByStoreId(storeId);
        return returnInvoices
                .stream()
                .map(ReturnInvoiceMapper::toReturnInvoiceDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReturnInvoiceDTO createReturnInvoice(ReturnInvoiceDTO returnInvoiceDTO) {
        Staff staff = staffService.getAuthorizedStaff();
        ReturnInvoice returnInvoice = ReturnInvoiceMapper.toReturnInvoice(returnInvoiceDTO);
        returnInvoice.setStaff(staff);
        returnInvoice.setStore(staff.getStore());
        returnInvoice.setCreatedAt(new Date());

        if (returnInvoiceDTO.getInvoiceId() != null) {
            returnInvoice.setInvoice(invoiceRepository.findById(returnInvoiceDTO.getInvoiceId()).orElseThrow(() ->
                    new CustomException("Invoice not found", HttpStatus.NOT_FOUND)));
        }
        if (returnInvoiceDTO.getReturnDetails() != null) {
            returnInvoice.setReturnDetails(returnInvoiceDTO.getReturnDetails()
                    .stream()
                    .map(returnDetailDTO -> {
                        ReturnDetail returnDetail = ReturnDetailMapper.toReturnDetail(returnDetailDTO);
                        returnDetail.setReturnInvoice(returnInvoice);
                        if (returnDetailDTO.getProductId() != null) {
                            Product product = productRepository.findById(returnDetailDTO.getProductId()).orElseThrow(() ->
                                    new CustomException("Product not found", HttpStatus.NOT_FOUND));
                            product.setStock(product.getStock() + returnDetailDTO.getQuantity());
                            productRepository.save(product);
                            returnDetail.setProduct(product);
                        }
                        return returnDetail;
                    })
                    .collect(Collectors.toList()));
        }
        returnInvoiceRepository.save(returnInvoice);
        int idReceiver = -1;
        if (returnInvoice.getInvoice().getCustomer() != null)
            idReceiver = returnInvoice.getInvoice().getCustomer().getId();
        expenseFormService.createExpenseForm("Customer", new Date(), returnInvoice.getPaymentMethod(), returnInvoice.getTotal(), idReceiver, returnInvoice.getNote(), "Expense for Customer", returnInvoice.getId());

        return ReturnInvoiceMapper.toReturnInvoiceDTO(returnInvoice);
    }

    @Override
    public ReturnInvoiceDTO updateReturnInvoice(int id, ReturnInvoiceDTO returnInvoiceDTO) {
        ReturnInvoice returnInvoice = returnInvoiceRepository.findById(id).orElseThrow(() ->
                new CustomException("Return invoice not found", HttpStatus.NOT_FOUND));
        returnInvoice.setTotal(returnInvoiceDTO.getTotal());
        returnInvoice.setReturnFee(returnInvoiceDTO.getReturnFee());
        returnInvoice.setDiscountValue(returnInvoiceDTO.getDiscountValue());
        returnInvoice.setPaymentMethod(returnInvoiceDTO.getPaymentMethod());
        returnInvoice.setNote(returnInvoiceDTO.getNote());
        returnInvoice.setCreatedAt(returnInvoiceDTO.getCreatedAt());
        returnInvoice.setStaff(staffService.getAuthorizedStaff());
        returnInvoice.setStore(staffService.getAuthorizedStaff().getStore());

        if (returnInvoiceDTO.getInvoiceId() != null) {
            returnInvoice.setInvoice(invoiceRepository.findById(returnInvoiceDTO.getInvoiceId()).orElseThrow(() ->
                    new CustomException("Invoice not found", HttpStatus.NOT_FOUND)));
        }
        if (returnInvoiceDTO.getReturnDetails() != null) {
            returnInvoice.getReturnDetails().clear();
            returnInvoice.getReturnDetails().addAll(returnInvoiceDTO.getReturnDetails()
                    .stream()
                    .map(returnDetailDTO -> {
                        ReturnDetail returnDetail = ReturnDetailMapper.toReturnDetail(returnDetailDTO);
                        returnDetail.setReturnInvoice(returnInvoice);
                        if (returnDetailDTO.getProductId() != null) {
                            Product product = productRepository.findById(returnDetailDTO.getProductId()).orElseThrow(() ->
                                    new CustomException("Product not found", HttpStatus.NOT_FOUND));
                            product.setStock(product.getStock() + returnDetailDTO.getQuantity());
                            productRepository.save(product);
                            returnDetail.setProduct(product);
                        }
                        return returnDetail;
                    })
                    .toList());
        }
        returnInvoiceRepository.save(returnInvoice);

        return ReturnInvoiceMapper.toReturnInvoiceDTO(returnInvoice);
    }

    @Override
    public void deleteReturnInvoice(int id) {
        ReturnInvoice returnInvoice = returnInvoiceRepository.findById(id).orElseThrow(() ->
                new CustomException("Return invoice not found", HttpStatus.NOT_FOUND));
        returnInvoiceRepository.delete(returnInvoice);
    }
}
