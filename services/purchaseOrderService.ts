import { PurchaseOrder } from "@/entities/PurchaseOrder";
import AxiosService from "./axiosService";

const getAllPurchaseOrders = async () => {
  return AxiosService.get<PurchaseOrder[]>("/api/purchase-orders");
};

const uploadPurchaseOrder = (data: any) => {
  return AxiosService.post<PurchaseOrder>("/api/purchase-orders", data);
};

const deletePurchaseOrder = (purchaseOrderId: number) => {
  return AxiosService.delete(`/api/purchase-orders/${purchaseOrderId}`);
};

const PurchaseOrderService = {
  getAllPurchaseOrders,
  uploadPurchaseOrder,
  deletePurchaseOrder,
};

export default PurchaseOrderService;
