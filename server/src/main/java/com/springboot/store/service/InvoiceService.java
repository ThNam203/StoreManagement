package com.springboot.store.service;

import com.springboot.store.payload.InvoiceDTO;

import java.util.List;

public interface InvoiceService {
    InvoiceDTO getInvoiceById(int id);
    List<InvoiceDTO> getAllInvoices();
    InvoiceDTO createInvoice(InvoiceDTO invoiceDTO);
    InvoiceDTO updateInvoice(int id, InvoiceDTO invoiceDTO);
    void deleteInvoice(int id);
}
