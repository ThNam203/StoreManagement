export type SaleTransactionReport = {
  invoices: SaleInvoice[];
  returns: SaleReturn[];
};

export type SaleInvoice = {
  invoiceId: number;
  date: string;
  quantity: number;
  total: number;
};

export type SaleReturn = {
  returnId: number;
  date: string;
  quantity: number;
  total: number;
};

export type SaleProfitByDayReport = {
  date: string;
  revenue: number;
  costPrice: number;
  profit: number;
}[];

export type RevenueByStaffReport = {
  staffId: number;
  staffName: string;
  revenueMoney: number;
  returnMoney: number;
}[];

export type TopProductsReport = {
  productId: number;
  totalCustomer: number;
  totalQuantity: number;
  revenue: number;
  totalReturn: number;
  returnRevenue: number;
  netRevenue: number;
  profit: number;
}[];

// record-of-product-sell

// export type ProductSellReport = {
//   productId: number;
//   name: string;
//   quantitySell: number;
//   quantityReturn: number;
//   totalSell: number;
//   totalReturn: number;
//   total: number;
//   listInvoice: ProductSellInvoice[];
//   listReturn: ProductSellReturn[];
// }[];

// export type ProductSellInvoice = {
//   date: string;
//   customerName: string;
//   quantity: number;
//   total: number;
// };

// export type ProductSellReturn = {
//   date: string;
//   customerName: string;
//   quantity: number;
//   total: number;
// };

// record-of-product-sell END

export type SaleByDayReport = {
  date: string;
  total: number;
  originalPrice: number;
  income: number;
}[];

export type CustomerReport = {
  customerId: number | null;
  customerName: string;
  subTotal: number;
  discountValue: number;
  revenue: number;
  returnRevenue: number;
  netRevenue: number;
}[];

export type FinanceReport = {
  salesRevenue: number;
  adjustmentDiscount: number;
  adjustmentReturn: number;
  netRevenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  salaryStaff: number;
  bonusStaff: number;
  penaltyStaff: number;
  netProfit: number;
};

// export type ProductReport = {
//   productId: number;
//   name: string;
//   quantitySell: number;
//   quantityReturn: number;
//   totalSell: number;
//   totalReturn: number;
//   total: number;
// }[];

export type SupplyTransactionReport = {
  supplierId: number;
  name: string;
  totalOfProduct: number;
  discount: number;
  totalPay: number;
  totalReturn: number;
  purchaseOrders: PurchaseOrder[];
  purchaseReturns: PurchaseReturn[];
}[];

export type PurchaseOrder = {
  id: number;
  date: string;
  staffName: string;
  total: number;
  discount: number;
  totalPay: number;
};

export type PurchaseReturn = {
  id: number;
  date: string;
  staffName: string;
  total: number;
  discount: number;
  totalPay: number;
};
