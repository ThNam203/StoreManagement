import { ReturnInvoiceServer } from "@/entities/ReturnInvoice";
import AxiosService from "./axios_service";
  
  const uploadReturnInvoice = (data: ReturnInvoiceServer) => {
    return AxiosService.post<ReturnInvoiceServer>("/api/return-invoices", data);
  };

  const getAllReturneInvoices = () => {
    return AxiosService.get<ReturnInvoiceServer[]>("api/return-invoices")
  }
  
  const ReturnInvoiceService = {uploadReturnInvoice,getAllReturneInvoices};
  
  export default ReturnInvoiceService;
  