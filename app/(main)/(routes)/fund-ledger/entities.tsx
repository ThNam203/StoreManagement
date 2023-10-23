export type Transaction = {
  id: any;
  createdDate: string;
  formType: FormType;
  value: string;
  creator: string;
  transactionType: TransactionType;
  targetType: TargetType;
  targetName: string;
  status: Status;
  note: string;
  //expenses_or_receipts: id, created_date, value, type (expense - receipt), payer_id (customer or supplier), target_id (payer or recevier), target_type (customer, staff, supplier or other), creator, status, expenses_or_receipts_type_id, link_to_expense_or_receipt (dẫn đến hóa đơn (nếu thu từ khách hàng...) hoặc phiếu nhập hàng nếu trả cho nhà cung cấp)
};

export enum FormType {
  EXPENSE = "Expense",
  RECEIPT = "Receipt",
}

export enum TransactionType {
  CASH = "Pay by cash",
  TRANSFER = "Bank Transfer",
}

export enum Status {
  PAID = "Paid",
  CANCELLED = "Cancelled",
}

export enum TargetType {
  CUSTOMER = "Customer",
  SUPPLIER = "Supplier",
  STAFF = "Staff",
}
