import AxiosService from "./axiosService";
import { Invoice } from "@/entities/Invoice";

const uploadInvoice = (data: Invoice) => {
  return AxiosService.post<Invoice>("/api/invoice", data);
};

const getAllInvoices = () => {
  return AxiosService.get<Invoice[]>("api/invoice");
};

const deleteInvoice = (invoiceId: number) => {
  return AxiosService.delete<Invoice>(`api/invoice${invoiceId}`);
};

const InvoiceService = { uploadInvoice, getAllInvoices, deleteInvoice };

export default InvoiceService;
