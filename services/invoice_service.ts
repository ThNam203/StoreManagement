import AxiosService from "./axios_service";
import { Invoice } from "@/entities/Invoice";
  
  const uploadInvoice = (data: Invoice) => {
    return AxiosService.post<Invoice>("/api/invoice", data);
  };

  const getAllInvoices = () => {
    return AxiosService.get<Invoice[]>("api/invoice")
  }
  
  const InvoiceService = {uploadInvoice,getAllInvoices};
  
  export default InvoiceService;
  