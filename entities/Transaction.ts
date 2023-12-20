export type Transaction = {
  id: any;
  targetType: TargetType;
  targetName: string;
  formType: FormType;
  description: string;
  transactionType: TransactionType;
  value: number;
  creator: string;
  createdDate: Date;
  status: Status;
  note: string;
};

export enum TransactionType {
  CASH = "Pay by cash",
  TRANSFER = "Bank Transfer",
}

export enum FormType {
  EXPENSE = "Expense",
  RECEIPT = "Receipt",
}

export enum TargetType {
  CUSTOMER = "Customer",
  SUPPLIER = "Supplier",
  STAFF = "Staff",
  OTHER = "Other",
}

export enum Status {
  PAID = "Paid",
  CANCELLED = "Cancelled",
}
