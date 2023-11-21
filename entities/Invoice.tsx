import { Product } from "./Product";
import { TransactionType } from "./Transaction";

export type PaymentMethod = "Cash" | "Bank transfer" | "Card";

export type Invoice = {
  id: number;
  discount: number;
  cash: number;
  changed: number;
  subTotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  // Customer customer;
  // Staff staff;
  // Coupon coupon;
  invoiceDetails: InvoiceDetail[];
};

export type InvoiceDetail = {
    id: number;
    quantity: number;
    price: number;
    description: string;
    productId: number;
}
