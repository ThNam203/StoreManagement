export type PurchaseOrder = {
  id: number;
  subtotal: number;
  discount: number;
  total: number;
  note: string;
  createdDate: string;
  purchaseOrderDetail: PurchaseOrderDetail[];
  staffId: number;
  supplierId: number;
};

export type PurchaseOrderDetail = {
  id: number;
  quantity: number;
  price: number;
  discount: number;
  productId: number;
};
