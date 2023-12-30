import { format } from "date-fns";
import AxiosService from "./axiosService";
import { CustomerReport, FinanceReport, ProductReport, ProductSellReport, RevenueByStaffReport, SaleByDayReport, SaleProfitByDayReport, SaleTransactionReport, SupplyTransactionReport, TopProductsReport } from "@/entities/Report";

const dateToUrlPath = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
};

const getSaleTransactionReport = (startDate: Date, endDate: Date) => {
    return AxiosService.get<SaleTransactionReport>(`/api/reports/sales?start=${dateToUrlPath(startDate)}&end=${dateToUrlPath(endDate)}`);
};

const getSaleProfitByDayReport = (startDate: Date, endDate: Date) => {
    return AxiosService.get<SaleProfitByDayReport>(`/api/reports/sales-with-profit?start=${dateToUrlPath(startDate)}&end=${dateToUrlPath(endDate)}`);
};

const getRevenueByStaffReport = (startDate: Date, endDate: Date) => {
    return AxiosService.get<RevenueByStaffReport>(`/api/reports/sales-of-staff?start=${dateToUrlPath(startDate)}&end=${dateToUrlPath(endDate)}`);
};

const getTopProductsRerport = (startDate: Date, endDate: Date) => {
    return AxiosService.get<TopProductsReport>(`/api/reports/sales-product-profit?start=${dateToUrlPath(startDate)}&end=${dateToUrlPath(endDate)}`);
};

const getProductSellRecordReport = (startDate: Date, endDate: Date) => {
    return AxiosService.get<ProductSellReport>(`/api/reports/record-of-product-sell?start=${dateToUrlPath(startDate)}&end=${dateToUrlPath(endDate)}`);
};
const getSaleByDayReport = (startDate: Date, endDate: Date) => {
    return AxiosService.get<SaleByDayReport>(`/api/reports/record-of-sale?start=${dateToUrlPath(startDate)}&end=${dateToUrlPath(endDate)}`);
};

const getCustomerReport = (startDate: Date, endDate: Date) => {
    return AxiosService.get<CustomerReport>(`/api/reports/sales-of-customer?start=${dateToUrlPath(startDate)}&end=${dateToUrlPath(endDate)}`);
};

const getFinanceReport = (startDate: Date, endDate: Date) => {
    return AxiosService.get<FinanceReport>(`/api/reports/financial-report?start=${dateToUrlPath(startDate)}&end=${dateToUrlPath(endDate)}`);
};

const getProductReport = (startDate: Date, endDate: Date) => {
    return AxiosService.get<ProductReport>(`/api/reports/record-of-product?start=${dateToUrlPath(startDate)}&end=${dateToUrlPath(endDate)}`);
};

const getSupplyTransactionReport = (startDate: Date, endDate: Date) => {
    return AxiosService.get<SupplyTransactionReport>(`/api/reports/record-of-supplier?start=${dateToUrlPath(startDate)}&end=${dateToUrlPath(endDate)}`);
};

const ReportService = {
    getSaleTransactionReport,
    getSaleProfitByDayReport,
    getRevenueByStaffReport,
    getTopProductsRerport,
    getProductSellRecordReport,
    getSaleByDayReport,
    getProductReport,
    getCustomerReport,
    getFinanceReport,
    getSupplyTransactionReport,
};

export default ReportService;