import { PurchaseOrder } from "@/entities/PurchaseOrder";
import AxiosService from "./axios_service";
import { Axios } from "axios";

const getAllPurchaseOrders = async () => {
  return AxiosService.get<PurchaseOrder[]>("/api/purchase-orders");
};

const uploadPurchaseOrder = (data: any) => {
  return AxiosService.post<PurchaseOrder>("/api/purchase-orders", data);
};

const updatePurchaseOrder = (data: PurchaseOrder) => {
  return AxiosService.put<PurchaseOrder>(`/api/stock-checks/${data.id}`, data);
};

const deletePurchaseOrder = (purchaseOrderId: number) => {
  return AxiosService.delete(`/api/stock-checks/${purchaseOrderId}`);
};

const PurchaseOrderService = {
  getAllPurchaseOrders,
  uploadPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
};

export default PurchaseOrderService;
