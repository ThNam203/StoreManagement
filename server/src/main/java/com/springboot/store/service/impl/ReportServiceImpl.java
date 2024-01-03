package com.springboot.store.service.impl;

import com.springboot.store.entity.*;
import com.springboot.store.payload.report.*;
import com.springboot.store.repository.CustomerRepository;
import com.springboot.store.repository.InvoiceRepository;
import com.springboot.store.repository.ProductRepository;
import com.springboot.store.repository.ReturnInvoiceRepository;
import com.springboot.store.service.ReportService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final StaffService staffService;
    private final InvoiceRepository invoiceRepository;
    private final ReturnInvoiceRepository returnInvoiceRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    @Override
    public Map<String, Object> getSalesReport(Date startDate, Date endDate) {
        endDate = new Date(endDate.getTime() + 86400000);

        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        Map<String, Object> salesReport = new HashMap<>();
         salesReport.put("invoices", invoiceRepository.findByStoreIdAndCreatedAtBetween(storeId, startDate, endDate)
                .stream()
                .map(invoice -> {
                    Map<String, Object> invoiceMap = new HashMap<>();
                    invoiceMap.put("invoiceId", invoice.getId());
                    invoiceMap.put("date", invoice.getCreatedAt());
                    invoiceMap.put("quantity", invoice.getInvoiceDetails().stream().mapToInt(InvoiceDetail::getQuantity).sum());
                    invoiceMap.put("total", invoice.getTotal());
                    return invoiceMap;
                })
                .toList());

        salesReport.put("returns", returnInvoiceRepository.findByStoreIdAndCreatedAtBetween(storeId, startDate, endDate)
                .stream()
                .map(returnInvoice -> {
                    Map<String, Object> invoiceMap = new HashMap<>();
                    invoiceMap.put("returnId", returnInvoice.getId());
                    invoiceMap.put("date", returnInvoice.getCreatedAt());
                    invoiceMap.put("quantity", returnInvoice.getReturnDetails().stream().mapToInt(ReturnDetail::getQuantity).sum());
                    invoiceMap.put("total", returnInvoice.getTotal());
                    return invoiceMap;
                })
                .toList());
        return salesReport;
    }

    @Override
    public List<SalesReportWithProfit> getSalesReportWithProfit(Date startDate, Date endDate) {
        endDate = new Date(endDate.getTime() + 86400000);
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<SalesReportWithProfit> salesReport = new ArrayList<>(invoiceRepository.findByStoreIdAndCreatedAtBetween(storeId, startDate, endDate)
                .stream()
                .map(invoice -> {
                    SalesReportWithProfit profit = SalesReportWithProfit.builder()
                            .date(invoice.getCreatedAt())
                            .revenue(invoice.getTotal())
                            .costPrice(invoice.getInvoiceDetails()
                                    .stream()
                                    .map(invoiceDetail -> {
                                        Product product = productRepository.findById(invoiceDetail.getProductId()).orElseThrow();
                                        double originalPrices = product.getOriginalPrices()
                                                .stream()
                                                .filter(originalPrice -> originalPrice.getCreatedAt().before(invoice.getCreatedAt()))
                                                .reduce((first, second) -> second)
                                                .orElseThrow()
                                                .getValue();
                                        return originalPrices * invoiceDetail.getQuantity();
                                    })
                                    .reduce(0.0, Double::sum))
                            .profit(0.0)
                            .build();
                    profit.setProfit(profit.getRevenue() - profit.getCostPrice());
                    return profit;
                })
                .toList());

        List<ReturnInvoice> returnInvoices = returnInvoiceRepository.findByStoreIdAndCreatedAtBetween(storeId, startDate, endDate);

        for (ReturnInvoice returnInvoice : returnInvoices) {
            // find same date (not time) invoice in salesReport and update revenue, costPrice, profit
            for (SalesReportWithProfit salesReportWithProfit : salesReport) {
                if (DateUtils.isSameDay(salesReportWithProfit.getDate(), returnInvoice.getCreatedAt())) {
                    salesReportWithProfit.setRevenue(salesReportWithProfit.getRevenue() - returnInvoice.getTotal());
                    salesReportWithProfit.setProfit(salesReportWithProfit.getRevenue() - salesReportWithProfit.getCostPrice());
                } else {
                    SalesReportWithProfit profit = SalesReportWithProfit.builder()
                            .date(returnInvoice.getCreatedAt())
                            .revenue(-returnInvoice.getTotal())
                            .costPrice(0.0)
                            .profit(-returnInvoice.getTotal())
                            .build();
                    salesReport.add(profit);
                }
            }
        }

        salesReport.sort(Comparator.comparing(SalesReportWithProfit::getDate));

        List<SalesReportWithProfit> salesReportWithProfits = new ArrayList<>();
        for (SalesReportWithProfit salesReportWithProfit : salesReport) {
            boolean found = false;
            for (SalesReportWithProfit salesReportWithProfit1 : salesReportWithProfits) {
                if (DateUtils.isSameDay(salesReportWithProfit.getDate(), salesReportWithProfit1.getDate())) {
                    salesReportWithProfit1.setRevenue(salesReportWithProfit1.getRevenue() + salesReportWithProfit.getRevenue());
                    salesReportWithProfit1.setCostPrice(salesReportWithProfit1.getCostPrice() + salesReportWithProfit.getCostPrice());
                    salesReportWithProfit1.setProfit(salesReportWithProfit1.getProfit() + salesReportWithProfit.getProfit());
                    found = true;
                    break;
                }
            }
            if (!found) {
                salesReportWithProfits.add(salesReportWithProfit);
            }
        }

        return salesReportWithProfits;
    }

    @Override
    public List<SalesReportOfStaff> getSalesReportOfStaff(Date startDate, Date endDate) {
        endDate = new Date(endDate.getTime() + 86400000);
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<Object[]> listIn = invoiceRepository.findSalesReportOfStaff(storeId, startDate, endDate);
        List<SalesReportOfStaff> salesReport = new ArrayList<>();

        for (Object[] objects : listIn) {

            salesReport.add(SalesReportOfStaff.builder()
                    .staffId(Integer.parseInt(objects[0].toString()))
                    .staffName(staffService.getStaffById(Integer.parseInt(objects[0].toString())).getName())
                    .revenueMoney(Double.parseDouble(objects[1].toString()))
                    .build());
        }

        List<Object[]> listRe = returnInvoiceRepository.findSalesReportOfStaff(storeId, startDate, endDate);
        for (Object[] objects : listRe) {
            String staffId = objects[0].toString();
            double returnMoney = Double.parseDouble(objects[1].toString());
            // find same staffId in salesReport and update returnMoney if not found add new
            boolean found = false;
            for (SalesReportOfStaff salesReportOfStaff : salesReport) {
                if (salesReportOfStaff.getStaffId().toString().equals(staffId)) {
                    salesReportOfStaff.setReturnMoney(returnMoney);
                    found = true;
                    break;
                }
            }
            if (!found) {
                salesReport.add(SalesReportOfStaff.builder()
                        .staffId(Integer.parseInt(staffId))
                        .staffName(staffService.getStaffById(Integer.parseInt(staffId)).getName())
                        .returnMoney(returnMoney)
                        .build());
            }
        }

        return salesReport;
    }

    @Override
    public List<ProductProfit> getSalesProductProfit(Date startDate, Date endDate) {
        endDate = new Date(endDate.getTime() + 86400000);
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<ProductProfit> productProfits = new ArrayList<>();
        List<Invoice> invoices = invoiceRepository.findByStoreIdAndCreatedAtBetween(storeId, startDate, endDate);

        for (Invoice invoice : invoices) {
            for (InvoiceDetail invoiceDetail : invoice.getInvoiceDetails()) {
                Product product = productRepository.findById(invoiceDetail.getProductId()).orElseThrow();
                double originalPrices = product.getOriginalPrices()
                        .stream()
                        .filter(originalPrice -> originalPrice.getCreatedAt().before(invoice.getCreatedAt()))
                        .reduce((first, second) -> second)
                        .orElseThrow()
                        .getValue();
                double profit = invoiceDetail.getQuantity() * (invoiceDetail.getPrice() - originalPrices);
                ProductProfit productProfit = ProductProfit.builder()
                        .productId(invoiceDetail.getProductId())
                        .profit(profit)
                        .totalCustomer(1)
                        .totalQuantity(invoiceDetail.getQuantity())
                        .revenue(invoiceDetail.getPrice() * invoiceDetail.getQuantity())
                        .totalReturn(0)
                        .returnRevenue(0)
                        .netRevenue(invoiceDetail.getPrice() * invoiceDetail.getQuantity())
                        .build();

                boolean found = false;
                for (ProductProfit productProfit1 : productProfits) {
                    if (productProfit1.getProductId().equals(productProfit.getProductId())) {
                        productProfit1.setProfit(productProfit1.getProfit() + profit);
                        productProfit1.setTotalCustomer(productProfit1.getTotalCustomer() + 1);
                        productProfit1.setTotalQuantity(productProfit1.getTotalQuantity() + invoiceDetail.getQuantity());
                        productProfit1.setRevenue(productProfit1.getRevenue() + invoiceDetail.getPrice() * invoiceDetail.getQuantity());
                        productProfit1.setNetRevenue(productProfit1.getNetRevenue() + invoiceDetail.getPrice() * invoiceDetail.getQuantity());
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    productProfits.add(productProfit);
                }
            }
        }

        List<ReturnInvoice> returnInvoices = returnInvoiceRepository.findByStoreIdAndCreatedAtBetween(storeId, startDate, endDate);
        for (ReturnInvoice returnInvoice : returnInvoices) {
            for (ReturnDetail returnDetail : returnInvoice.getReturnDetails()) {
                Product product = returnDetail.getProduct();
                double originalPrices = product.getOriginalPrices()
                        .stream()
                        .filter(originalPrice -> originalPrice.getCreatedAt().before(returnInvoice.getCreatedAt()))
                        .reduce((first, second) -> second)
                        .orElseThrow()
                        .getValue();
                double profit = returnDetail.getQuantity() * (returnDetail.getPrice() - originalPrices);
                ProductProfit productProfit = ProductProfit.builder()
                        .productId(returnDetail.getProduct().getId())
                        .profit(profit)
                        .totalCustomer(0)
                        .totalQuantity(0)
                        .revenue(0)
                        .totalReturn(1)
                        .returnRevenue(returnDetail.getPrice() * returnDetail.getQuantity())
                        .netRevenue(-returnDetail.getPrice() * returnDetail.getQuantity())
                        .build();

                boolean found = false;
                for (ProductProfit productProfit1 : productProfits) {
                    if (productProfit1.getProductId().equals(productProfit.getProductId())) {
                        productProfit1.setProfit(productProfit1.getProfit() + profit);
                        productProfit1.setTotalReturn(productProfit1.getTotalReturn() + 1);
                        productProfit1.setReturnRevenue(productProfit1.getReturnRevenue() + returnDetail.getPrice() * returnDetail.getQuantity());
                        productProfit1.setNetRevenue(productProfit1.getNetRevenue() - returnDetail.getPrice() * returnDetail.getQuantity());
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    productProfits.add(productProfit);
                }
            }
        }

        productProfits.sort(Comparator.comparing(ProductProfit::getNetRevenue).reversed());

        return productProfits;
    }

    @Override
    public List<SalesReportOfCustomer> getSalesReportOfCustomer(Date startDate, Date endDate) {
        endDate = new Date(endDate.getTime() + 86400000);
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<Object[]> listIn = invoiceRepository.findSalesReportOfCustomer(storeId, startDate, endDate);
        List<SalesReportOfCustomer> salesReport = new ArrayList<>();

        for (Object[] objects : listIn) {
            salesReport.add(SalesReportOfCustomer.builder()
                    .customerId(objects[0] == null ? null : Integer.parseInt(objects[0].toString()))
                    .customerName(objects[0] == null ? "Khách yêu" : customerRepository.findById(Integer.parseInt(objects[0].toString())).orElseThrow().getName())
                    .subTotal(Double.parseDouble(objects[1].toString()))
                    .discountValue(Double.parseDouble(objects[2].toString()))
                    .revenue(Double.parseDouble(objects[3].toString()))
                    .netRevenue(Double.parseDouble(objects[3].toString()) - Double.parseDouble(objects[2].toString()))
                    .build());
        }

        List<ReturnInvoice> listRe = returnInvoiceRepository.findByStoreIdAndCreatedAtBetween(storeId, startDate, endDate);

        for (ReturnInvoice returnInvoice : listRe) {
            SalesReportOfCustomer salesReportOfCustomer = SalesReportOfCustomer.builder()
                    .customerId(returnInvoice.getInvoice().getCustomer() == null ? null : returnInvoice.getInvoice().getCustomer().getId())
                    .customerName(returnInvoice.getInvoice().getCustomer() == null ? "Khách yêu" : returnInvoice.getInvoice().getCustomer().getName())
                    .subTotal(0)
                    .discountValue(0)
                    .revenue(0)
                    .returnRevenue(returnInvoice.getTotal())
                    .netRevenue(-returnInvoice.getTotal())
                    .build();
            boolean found = false;
            for (SalesReportOfCustomer salesReportOfCustomer1 : salesReport) {
                if (salesReportOfCustomer1.getCustomerId() == null) {
                    if (salesReportOfCustomer1.getCustomerName().equals(salesReportOfCustomer.getCustomerName())) {
                        salesReportOfCustomer1.setReturnRevenue(salesReportOfCustomer1.getReturnRevenue() + returnInvoice.getTotal());
                        salesReportOfCustomer1.setNetRevenue(salesReportOfCustomer1.getNetRevenue() - returnInvoice.getTotal());
                        found = true;
                        break;
                    }
                } else if (salesReportOfCustomer1.getCustomerId().equals(salesReportOfCustomer.getCustomerId())) {
                    salesReportOfCustomer1.setReturnRevenue(salesReportOfCustomer1.getReturnRevenue() + returnInvoice.getTotal());
                    salesReportOfCustomer1.setNetRevenue(salesReportOfCustomer1.getNetRevenue() - returnInvoice.getTotal());
                    found = true;
                    break;
                }
            }
            if (!found) {
                salesReport.add(salesReportOfCustomer);
            }
        }
        salesReport.sort(Comparator.comparing(SalesReportOfCustomer::getNetRevenue).reversed());

        return salesReport;
    }

    @Override
    public FinancialReport getFinancialReport(Date startDate, Date endDate) {
        endDate = new Date(endDate.getTime() + 86400000);
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        FinancialReport financialReport = new FinancialReport();

        List<Invoice> invoices = invoiceRepository.findByStoreIdAndCreatedAtBetween(storeId, startDate, endDate);

        for (Invoice invoice : invoices) {
            financialReport.setSalesRevenue(financialReport.getSalesRevenue() + invoice.getTotal());
            financialReport.setCostOfGoodsSold(financialReport.getCostOfGoodsSold() + invoice.getInvoiceDetails()
                    .stream()
                    .mapToDouble(invoiceDetail -> {
                        Product product = productRepository.findById(invoiceDetail.getProductId()).orElseThrow();
                        double originalPrices = product.getOriginalPrices()
                                .stream()
                                .filter(originalPrice -> originalPrice.getCreatedAt().before(invoice.getCreatedAt()))
                                .reduce((first, second) -> second)
                                .orElseThrow()
                                .getValue();
                        return originalPrices * invoiceDetail.getQuantity();
                    })
                    .sum());
            financialReport.setAdjustmentDiscount(financialReport.getAdjustmentDiscount() + invoice.getDiscountValue());
        }

        financialReport.setNetRevenue(financialReport.getSalesRevenue() - financialReport.getAdjustmentDiscount());

        List<ReturnInvoice> returnInvoices = returnInvoiceRepository.findByStoreIdAndCreatedAtBetween(storeId, startDate, endDate);

        for (ReturnInvoice returnInvoice : returnInvoices) {
            financialReport.setAdjustmentReturn(financialReport.getAdjustmentReturn() + returnInvoice.getTotal());
            financialReport.setNetRevenue(financialReport.getNetRevenue() - returnInvoice.getTotal());
            financialReport.setCostOfGoodsSold(financialReport.getCostOfGoodsSold() - returnInvoice.getReturnDetails()
                    .stream()
                    .mapToDouble(returnDetail -> {
                        Product product = returnDetail.getProduct();
                        double originalPrices = product.getOriginalPrices()
                                .stream()
                                .filter(originalPrice -> originalPrice.getCreatedAt().before(returnInvoice.getCreatedAt()))
                                .reduce((first, second) -> second)
                                .orElseThrow()
                                .getValue();
                        return originalPrices * returnDetail.getQuantity();
                    })
                    .sum());
        }

        financialReport.setGrossProfit(financialReport.getNetRevenue() - financialReport.getCostOfGoodsSold());

        financialReport.setNetProfit(financialReport.getGrossProfit()
                - financialReport.getSalaryStaff()
                - financialReport.getBonusStaff()
                + financialReport.getPenaltyStaff());

        return financialReport;
    }

}
