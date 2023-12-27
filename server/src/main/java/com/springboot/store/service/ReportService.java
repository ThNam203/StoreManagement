package com.springboot.store.service;

import com.springboot.store.payload.report.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface ReportService {
    Map<String, Object> getSalesReport(Date startDate, Date endDate);
    List<SalesReportWithProfit> getSalesReportWithProfit(Date startDate, Date endDate);
    List<SalesReportOfStaff> getSalesReportOfStaff(Date startDate, Date endDate);
    List<ProductProfit> getSalesProductProfit(Date startDate, Date endDate);
    List<SalesReportOfCustomer> getSalesReportOfCustomer(Date startDate, Date endDate);
    FinancialReport getFinancialReport(Date startDate, Date endDate);
}
