package com.springboot.store.service.impl;

import com.springboot.store.entity.*;
import com.springboot.store.payload.RecordOfProductDTO;
import com.springboot.store.repository.InvoiceRepository;
import com.springboot.store.repository.ReturnInvoiceRepository;
import com.springboot.store.service.ProductService;
import com.springboot.store.service.RecordOfProductService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RecordOfProductServiceImpl implements RecordOfProductService {
    private final InvoiceRepository invoiceRepository;
    private final ReturnInvoiceRepository returnInvoiceRepository;
    private final ProductService productService;
    private final StaffService staffService;

    @Override
    public List<RecordOfProductDTO> getAllRecordOfProduct(Date startDate, Date endDate) {
        endDate = new Date(endDate.getTime() + 86400000);
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<Invoice> invoices = invoiceRepository.findByCreatedAtBetween(startDate, endDate, storeId);
        List<ReturnInvoice> returnInvoices = returnInvoiceRepository.findByCreatedAtBetween(startDate, endDate, storeId);
        //create new map to store all product
        Map<Integer, Product> productMap = productService.getAllProductMap();
        //Get all product and store in map
        Map<Integer, RecordOfProductDTO> recordOfProductDTOMap = new HashMap<>();

        for (Invoice invoice : invoices) {
            for (InvoiceDetail invoiceDetail : invoice.getInvoiceDetails()) {
                RecordOfProductDTO recordOfProductDTO = recordOfProductDTOMap.computeIfAbsent(invoiceDetail.getProductId(), id -> createNewRecordOfProductDTO(id, productMap.get(id)));
                updateRecordOfProductDTOForInvoice(recordOfProductDTO, invoiceDetail);
            }
        }
        for (ReturnInvoice returnInvoice : returnInvoices) {
            for (ReturnDetail returnDetail : returnInvoice.getReturnDetails()) {
                RecordOfProductDTO recordOfProductDTO = recordOfProductDTOMap.computeIfAbsent(returnDetail.getProduct().getId(), id -> createNewRecordOfProductDTOFromReturn(id, returnDetail));
                updateRecordOfProductDTOForReturnInvoice(recordOfProductDTO, returnDetail);
            }
        }

        return new ArrayList<>(recordOfProductDTOMap.values());
    }

    private RecordOfProductDTO createNewRecordOfProductDTO(int productId, Product product) {
        return new RecordOfProductDTO(productId, product.getName(), 0, 0, 0, 0, 0);
    }

    private RecordOfProductDTO createNewRecordOfProductDTOFromReturn(int productId, ReturnDetail returnDetail) {
        return new RecordOfProductDTO(productId, returnDetail.getProduct().getName(), 0, 0, 0, 0, 0);
    }

    private void updateRecordOfProductDTOForInvoice(RecordOfProductDTO recordOfProductDTO, InvoiceDetail invoiceDetail) {
        recordOfProductDTO.setQuantitySell(recordOfProductDTO.getQuantitySell() + invoiceDetail.getQuantity());
        recordOfProductDTO.setTotalSell((recordOfProductDTO.getTotalSell() + invoiceDetail.getQuantity() * invoiceDetail.getPrice()));
        recordOfProductDTO.setTotal(recordOfProductDTO.getTotalSell() - recordOfProductDTO.getTotalReturn());
    }

    private void updateRecordOfProductDTOForReturnInvoice(RecordOfProductDTO recordOfProductDTO, ReturnDetail returnDetail) {
        recordOfProductDTO.setQuantityReturn(recordOfProductDTO.getQuantityReturn() + returnDetail.getQuantity());
        recordOfProductDTO.setTotalReturn((recordOfProductDTO.getTotalReturn() + returnDetail.getQuantity() * returnDetail.getPrice()));
        recordOfProductDTO.setTotal(recordOfProductDTO.getTotalSell() - recordOfProductDTO.getTotalReturn());
    }
}
