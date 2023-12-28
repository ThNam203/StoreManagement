package com.springboot.store.service.impl;

import com.springboot.store.entity.*;
import com.springboot.store.payload.RecordOfSaleDTO;
import com.springboot.store.repository.InvoiceRepository;
import com.springboot.store.repository.ProductRepository;
import com.springboot.store.repository.ReturnInvoiceRepository;
import com.springboot.store.service.ProductService;
import com.springboot.store.service.RecordOfSaleService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecordOfSaleServiceImpl implements RecordOfSaleService {
    private final InvoiceRepository invoiceRepository;
    private final ReturnInvoiceRepository returnInvoiceRepository;
    private final ProductRepository productRepository;
    private final StaffService staffService;
    private final ProductService productService;

    @Override
    public List<RecordOfSaleDTO> getAllRecordOfSale(Date startDate, Date endDate) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Store store = staffService.getAuthorizedStaff().getStore();
        List<Invoice> invoices = invoiceRepository.findByCreatedAtBetween(startDate, endDate, store.getId());
        List<ReturnInvoice> returnInvoices = returnInvoiceRepository.findByCreatedAtBetween(startDate, endDate, store.getId());
        Map<Integer, Product> productMap = productService.getAllProductMap();
        List<RecordOfSaleDTO> recordOfSaleDTOS = new ArrayList<>();

        // Group invoices and return invoices by date
        Map<String, List<Invoice>> groupedInvoices = invoices.stream().collect(Collectors.groupingBy(invoice -> sdf.format(invoice.getCreatedAt())));
        Map<String, List<ReturnInvoice>> groupedReturnInvoices = returnInvoices.stream().collect(Collectors.groupingBy(returnInvoice -> sdf.format(returnInvoice.getCreatedAt())));

        // For each day in the date range
        for (LocalDate date = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate(); date.isBefore(endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().plusDays(1)); date = date.plusDays(1)) {
            String currentDate = date.toString();

            // Get invoices and return invoices for the current day
            List<Invoice> dailyInvoices = groupedInvoices.getOrDefault(currentDate, new ArrayList<>());
            List<ReturnInvoice> dailyReturnInvoices = groupedReturnInvoices.getOrDefault(currentDate, new ArrayList<>());
            long originalPrice = 0;
            long total = 0;
            long income;
            for (Invoice invoice : dailyInvoices) {
                for (InvoiceDetail invoiceDetail : invoice.getInvoiceDetails()) {
                    originalPrice += (long) (productMap.get(invoiceDetail.getProductId()).getOriginalPriceBeforeDate(Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant())).getValue() * invoiceDetail.getQuantity());
                }
                total += (int) invoice.getTotal();
            }
            for (ReturnInvoice returnInvoice : dailyReturnInvoices) {
                for (ReturnDetail returnDetail : returnInvoice.getReturnDetails()) {
                    originalPrice -= (long) (returnDetail.getProduct().getOriginalPriceBeforeDate(Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant())).getValue() * returnDetail.getQuantity());
                }
                total -= returnInvoice.getTotal();
            }
            income = total - originalPrice;
            // Create a RecordOfSaleDTO object and add it to the list
            recordOfSaleDTOS.add(new RecordOfSaleDTO(Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant()), total, originalPrice, income));
        }
        return recordOfSaleDTOS;
    }
}
