import { TransactionType } from "./Transaction";

export type Invoice = {
  //id, customer_id (optional), discount (% or vnd), money_given, change, pay_method, created_date, staff_id, voucher (coupon), VAT
  id: any;
  customerId?: any;
  discountType: DiscountType;
  discount: number;
  subTotal: number;
  total: number;
  moneyGiven: number;
  change: number;
  transactionType: TransactionType;
  createdDate: Date;
  creator: any;
  voucher?: any;
  VAT: number;
};

export enum DiscountType {
  PERCENT = "Percent",
  MONEY = "Money",
}
