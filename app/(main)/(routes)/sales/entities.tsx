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
  EXPENSE = "EXPENSE",
  RECEIPT = "RECEIPT",
}

export enum TransactionType {
  CASH = "PAY BY CASH",
  TRANSFER = "BANK TRANSFER",
}

export enum Status {
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export enum TargetType {
  CUSTOMER = "CUSTOMER",
  SUPPLIER = "SUPPLIER",
  STAFF = "STAFF",
}
