import { ReturnInvoiceServer } from "@/entities/ReturnInvoice";
import AxiosService from "./axios_service";
  
  const uploadReturnInvoice = (data: ReturnInvoiceServer) => {
    return AxiosService.post<ReturnInvoiceServer>("/api/return-invoices", data);
  };

  const getAllReturnInvoices = () => {
    return AxiosService.get<ReturnInvoiceServer[]>("api/return-invoices")
  }

  const deleteReturnInvoice = (returnInvoiceId: number) => {
    return AxiosService.delete<ReturnInvoiceServer[]>(`api/return-invoices/${returnInvoiceId}`)
  }
  
  const ReturnInvoiceService = {uploadReturnInvoice,getAllReturnInvoices, deleteReturnInvoice};
  
  export default ReturnInvoiceService;
  