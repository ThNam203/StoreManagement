import AxiosService from "./axios_service";
import { Invoice } from "@/entities/Invoice";
  
  const uploadInvoice = (data: Invoice) => {
    return AxiosService.post<any>("/api/invoice", data);
  };
  
  const InvoiceService = {uploadInvoice};
  
  export default InvoiceService;
  