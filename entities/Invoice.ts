export type InvoicePaymentMethod = "Cash" | "Bank transfer" | "Card";
export enum PAYMENT_METHODS {
  Cash = "Cash",
  BankTransfer = "Bank transfer",
  Card = "Card",
}

export type Invoice = {
  id: number;
  discountValue: number;
  discountCode: string | null;
  cash: number;
  changed: number;
  subTotal: number;
  total: number;
  paymentMethod: InvoicePaymentMethod;
  createdAt: string;
  customerId: number | null;
  staffId: number;
  invoiceDetails: InvoiceDetail[];
  note: string;
};

export type InvoiceDetail = {
    id: number;
    quantity: number;
    price: number;
    description: string;
    productId: number;
}
