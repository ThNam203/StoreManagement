import AxiosService from "./axiosService";
import { PurchaseReturn } from "@/entities/PurchaseReturn";

const getAllPurchaseReturns = async () => {
  return AxiosService.get<PurchaseReturn[]>("/api/purchase-returns");
};

const uploadPurchaseReturn = (data: any) => {
  return AxiosService.post<PurchaseReturn>("/api/purchase-returns", data);
};

const deletePurchaseReturn = (purchaseOrderId: number) => {
  return AxiosService.delete(`/api/purchase-returns/${purchaseOrderId}`);
};

const PurchaseReturnService = {
    getAllPurchaseReturns,
    uploadPurchaseReturn,
    deletePurchaseReturn
};

export default PurchaseReturnService;
