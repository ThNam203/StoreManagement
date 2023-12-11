export type PaymentMethod = "Cash" | "Bank transfer" | "Card";

export type Invoice = {
  id: number;
  discountValue: number;
  discountCode: string;
  cash: number;
  changed: number;
  subTotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  customerId: number | null;
  // Staff staff;
  // Coupon coupon;
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
