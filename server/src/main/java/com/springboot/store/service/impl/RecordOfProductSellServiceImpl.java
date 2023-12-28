package com.springboot.store.service.impl;

import com.springboot.store.entity.*;
import com.springboot.store.payload.InvoiceInRecordOfProductSellDTO;
import com.springboot.store.payload.ReturnInRecordOfProductSellDTO;
import com.springboot.store.payload.RecordOfProductSellDTO;
import com.springboot.store.repository.InvoiceRepository;
import com.springboot.store.repository.ProductRepository;
import com.springboot.store.repository.ReturnInvoiceRepository;
import com.springboot.store.service.ProductService;
import com.springboot.store.service.RecordOfProductSellService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RecordOfProductSellServiceImpl implements RecordOfProductSellService {
    private final InvoiceRepository invoiceRepository;
    private final ReturnInvoiceRepository returnInvoiceRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final StaffService staffService;

    @Override
    public List<RecordOfProductSellDTO> getAllRecordOfProductSell(Date date) {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<Invoice> invoices = invoiceRepository.findByStoreIdAndDate(storeId, date);
        List<ReturnInvoice> returnInvoices = returnInvoiceRepository.findByStoreIdAndDate(storeId, date);
        //create new map to store all product
        Map<Integer, Product> productMap = productService.getAllProductMap();
        //Get all product and store in map

        Map<Integer, RecordOfProductSellDTO> recordOfProductSellDTOMap = new HashMap<>();

        for (Invoice invoice : invoices) {
            for (InvoiceDetail invoiceDetail : invoice.getInvoiceDetails()) {
                RecordOfProductSellDTO recordOfProductSellDTO = recordOfProductSellDTOMap.computeIfAbsent(invoiceDetail.getProductId(), id -> createNewRecordOfProductSellDTO(id, productMap.get(id)));
                updateRecordOfProductSellDTOForInvoice(recordOfProductSellDTO, invoice, invoiceDetail);
            }
        }

        for (ReturnInvoice returnInvoice : returnInvoices) {
            for (ReturnDetail returnDetail : returnInvoice.getReturnDetails()) {
                RecordOfProductSellDTO recordOfProductSellDTO = recordOfProductSellDTOMap.computeIfAbsent(returnDetail.getProduct().getId(), id -> createNewRecordOfProductSellDTOFromReturn(id, returnDetail));
                updateRecordOfProductSellDTOForReturnInvoice(recordOfProductSellDTO, returnInvoice, returnDetail);
            }
        }

        return new ArrayList<>(recordOfProductSellDTOMap.values());
    }

    private RecordOfProductSellDTO createNewRecordOfProductSellDTO(int productId, Product product) {
        return new RecordOfProductSellDTO(productId, product.getName(), 0, 0, 0, 0, 0, new ArrayList<>(), new ArrayList<>());
    }

    private RecordOfProductSellDTO createNewRecordOfProductSellDTOFromReturn(int productId, ReturnDetail returnDetail) {

        return new RecordOfProductSellDTO(productId, returnDetail.getProduct().getName(), 0, 0, 0, 0, 0, new ArrayList<>(), new ArrayList<>());
    }

    private void updateRecordOfProductSellDTOForInvoice(RecordOfProductSellDTO recordOfProductSellDTO, Invoice invoice, InvoiceDetail invoiceDetail) {
        recordOfProductSellDTO.setQuantitySell(recordOfProductSellDTO.getQuantitySell() + invoiceDetail.getQuantity());
        recordOfProductSellDTO.setTotalSell((recordOfProductSellDTO.getTotalSell() + invoiceDetail.getQuantity() * invoiceDetail.getPrice()));
        recordOfProductSellDTO.setTotal(recordOfProductSellDTO.getTotalSell() - recordOfProductSellDTO.getTotalReturn());
        InvoiceInRecordOfProductSellDTO invoiceInRecordOfProductSellDTO = getInvoiceInRecordOfProductSellDTO(invoice, invoiceDetail);
        recordOfProductSellDTO.getListInvoice().add(invoiceInRecordOfProductSellDTO);
    }

    private void updateRecordOfProductSellDTOForReturnInvoice(RecordOfProductSellDTO recordOfProductSellDTO, ReturnInvoice returnInvoice, ReturnDetail returnDetail) {
        if (returnDetail.getQuantity() == 0) return;
        recordOfProductSellDTO.setQuantityReturn(recordOfProductSellDTO.getQuantityReturn() + returnDetail.getQuantity());
        recordOfProductSellDTO.setTotalReturn(recordOfProductSellDTO.getTotalReturn() + returnDetail.getQuantity() * returnDetail.getPrice());
        recordOfProductSellDTO.setTotal(recordOfProductSellDTO.getTotalSell() - recordOfProductSellDTO.getTotalReturn());
        ReturnInRecordOfProductSellDTO returnInRecordOfProductSellDTO = getReturnInRecordOfProductSellDTO(returnInvoice, returnDetail);
        recordOfProductSellDTO.getListReturn().add(returnInRecordOfProductSellDTO);
    }

    private static InvoiceInRecordOfProductSellDTO getInvoiceInRecordOfProductSellDTO(Invoice invoice, InvoiceDetail invoiceDetail) {
        InvoiceInRecordOfProductSellDTO invoiceInRecordOfProductSellDTO = new InvoiceInRecordOfProductSellDTO();
        invoiceInRecordOfProductSellDTO.setQuantity(invoiceDetail.getQuantity());
        invoiceInRecordOfProductSellDTO.setTotal((invoiceDetail.getQuantity() * invoiceDetail.getPrice()));
        if (invoice.getCustomer() != null)
            invoiceInRecordOfProductSellDTO.setCustomerName(invoice.getCustomer().getName());
        else
            invoiceInRecordOfProductSellDTO.setCustomerName("Retail Customer");
        invoiceInRecordOfProductSellDTO.setDate(invoice.getCreatedAt());
        return invoiceInRecordOfProductSellDTO;
    }

    private static ReturnInRecordOfProductSellDTO getReturnInRecordOfProductSellDTO(ReturnInvoice returnInvoice, ReturnDetail invoiceDetail) {
        ReturnInRecordOfProductSellDTO returnInRecordOfProductSellDTO = new ReturnInRecordOfProductSellDTO();
        returnInRecordOfProductSellDTO.setQuantity(invoiceDetail.getQuantity());
        returnInRecordOfProductSellDTO.setTotal(invoiceDetail.getQuantity() * invoiceDetail.getPrice());
        if (returnInvoice.getInvoice().getCustomer() != null)
            returnInRecordOfProductSellDTO.setCustomerName(returnInvoice.getInvoice().getCustomer().getName());
        else
            returnInRecordOfProductSellDTO.setCustomerName("Retail Customer");
        returnInRecordOfProductSellDTO.setDate(returnInvoice.getCreatedAt());
        return returnInRecordOfProductSellDTO;
    }


}
