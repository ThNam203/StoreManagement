package com.springboot.store.service.impl;

import com.springboot.store.entity.Invoice;
import com.springboot.store.entity.InvoiceDetail;
import com.springboot.store.entity.Staff;
import com.springboot.store.exception.CustomException;
import com.springboot.store.mapper.InvoiceDetailMapper;
import com.springboot.store.mapper.InvoiceMapper;
import com.springboot.store.payload.InvoiceDTO;
import com.springboot.store.repository.InvoiceRepository;
import com.springboot.store.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final StaffServiceImpl staffService;

    @Override
    public InvoiceDTO getInvoiceById(int id) {
        Invoice invoice = invoiceRepository.findById(id).orElseThrow(() -> new CustomException("Invoice with id " + id + " does not exist", HttpStatus.NOT_FOUND));
        return InvoiceMapper.toInvoiceDTO(invoice);
    }

    @Override
    public List<InvoiceDTO> getAllInvoices() {
        List<Invoice> invoices = invoiceRepository.findAll();
        return invoices.stream().map(InvoiceMapper::toInvoiceDTO).toList();
    }

    @Override
    public InvoiceDTO createInvoice(InvoiceDTO invoiceDTO) {
        Invoice invoice = InvoiceMapper.toInvoice(invoiceDTO);
        invoice.setCreatedAt(new Date());
        // TODO: set customer and staff
        Staff staff = staffService.getAuthorizedStaff();
        invoice.setStaff(staff);

        if (invoiceDTO.getInvoiceDetails() != null) {
            Set<InvoiceDetail> invoiceDetails = invoiceDTO.getInvoiceDetails()
                            .stream()
                            .map(invoiceDetailDTO -> InvoiceDetail.builder()
                                    .quantity(invoiceDetailDTO.getQuantity())
                                    .price(invoiceDetailDTO.getPrice())
                                    .productId(invoiceDetailDTO.getProductId())
                                    .description(invoiceDetailDTO.getDescription())
                                    .build()
                            )
                            .collect(Collectors.toSet());
            invoice.setInvoiceDetails(invoiceDetails);
        }

        Invoice invoiceNew = invoiceRepository.save(invoice);
        return InvoiceMapper.toInvoiceDTO(invoiceNew);
    }

    @Override
    public InvoiceDTO updateInvoice(int id, InvoiceDTO invoiceDTO) {
        Invoice invoice = invoiceRepository.findById(id).orElseThrow(() -> new CustomException("Invoice with id " + id + " does not exist", HttpStatus.NOT_FOUND));
        invoice.setCash(invoiceDTO.getCash());
        invoice.setChanged(invoiceDTO.getChanged());
        invoice.setSubTotal(invoiceDTO.getSubTotal());
        invoice.setTotal(invoiceDTO.getTotal());
        invoice.setStatus(invoiceDTO.getStatus());
        invoice.setPaymentMethod(invoiceDTO.getPaymentMethod());
        invoice.setCreatedAt(new Date());

        if (invoiceDTO.getInvoiceDetails() != null) {
            invoice.setInvoiceDetails(
                    invoiceDTO.getInvoiceDetails()
                            .stream()
                            .map(InvoiceDetailMapper::toInvoiceDetail)
                            .collect(Collectors.toSet()));
        }
        // TODO: set customer and staff

        Invoice invoiceNew = invoiceRepository.save(invoice);
        return InvoiceMapper.toInvoiceDTO(invoiceNew);
    }

    @Override
    public void deleteInvoice(int id) {
        checkInvoiceExist(id);
        invoiceRepository.deleteById(id);
    }

    private void checkInvoiceExist(int id) {
        if (!invoiceRepository.existsById(id)) {
            throw new CustomException("Invoice with id " + id + " does not exist", HttpStatus.NOT_FOUND);
        }
    }
}