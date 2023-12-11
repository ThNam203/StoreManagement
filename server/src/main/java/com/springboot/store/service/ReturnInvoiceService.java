package com.springboot.store.service;

import com.springboot.store.payload.ReturnInvoiceDTO;

import java.util.List;

public interface ReturnInvoiceService {
    ReturnInvoiceDTO getReturnInvoiceById(int id);
    List<ReturnInvoiceDTO> getAllReturnInvoices();
    ReturnInvoiceDTO createReturnInvoice(ReturnInvoiceDTO returnInvoiceDTO);
    ReturnInvoiceDTO updateReturnInvoice(int id, ReturnInvoiceDTO returnInvoiceDTO);
    void deleteReturnInvoice(int id);

}
