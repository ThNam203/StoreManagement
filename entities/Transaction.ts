export type Transaction = {
  id: any;
  targetType: TargetType;
  targetId: any;
  targetName: string;
  formType: FormType;
  description: TransactionDesc;
  transactionType: TransactionType; //Expense type / Receipt type base on formType
  value: number;
  creator: string;
  time: Date;
  status: Status;
  note: string;
  linkFormId: number;
};

export enum TransactionType {
  CASH = "Pay by cash",
  TRANSFER = "Bank Transfer",
  OTHER = "Other",
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

export type Stranger = {
  id: any;
  name: string;
  phoneNumber: string;
  address: string;
  note: string;
};

export enum Status {
  PAID = "Paid",
  CANCELLED = "Cancelled",
}

export enum TransactionDesc {
  EXPENSE_STAFF = "Expense for staff salary",
  EXPENSE_CUSTOMER = "Expense for customer",
  EXPENSE_SUPPLIER = "Expense for supplier",
  EXPENSE_OTHER = "Expense for other",
  RECEIPT_CUSTOMER = "Income from customer",
  RECEIPT_SUPPLIER = "Income from supplier",
  RECEIPT_OTHER = "Income from other",
}

export type DetailSalaryDebt = {
  id: any;
  totalSalary: number;
  paid: number;
  needToPay: number;
  value: number;
};
