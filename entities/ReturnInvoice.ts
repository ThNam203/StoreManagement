export type InvoicePaymentMethod = "Cash" | "Bank transfer" | "Card";


// SERVER is used for calling with backend
export type ReturnInvoiceServer = {
  id: number;
  discountValue: number;
  returnFee: number;
  createdAt: string;
  total: number;
  staffId: number;
  returnDetails: ReturnInvoiceDetailServer[];
  note: string;
  paymentMethod: InvoicePaymentMethod;
  invoiceId: number;
};

export type ReturnInvoiceDetailServer = {
  id: number;
  quantity: number;
  price: number;
  description: string;
  productId: number;
}

// convert to CLIENT to use in client
export type ReturnInvoiceClient = {
  id: number;
  discountValue: number;
  returnFee: number;
  createdAt: string;
  subTotal: number;
  total: number;
  staffId: number;
  returnDetails: ReturnInvoiceDetailClient[];
  paymentMethod: InvoicePaymentMethod;
  note: string;
  invoiceId: number;
};

export type ReturnInvoiceDetailClient = {
    id: number;
    quantity: number;
    price: number;
    description: string;
    productId: number;
    maxQuantity: number;
}
