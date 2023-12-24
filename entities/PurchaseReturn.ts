export type PurchaseReturn = {
    id: number;
    subtotal: number;
    discount: number;
    total: number;
    note: string;
    createdDate: string;
    purchaseReturnDetails: PurchaseReturnDetail[];
    staffId: number;
    supplierId: number;
  };
  
  export type PurchaseReturnDetail = {
    id: number;
    quantity: number;
    supplyPrice: number;
    returnPrice: number;
    note: string;
    productId: number;
  };
  