"use client";

import {
  defaultColumn,
  defaultSelectColumn,
  defaultIndexColumn,
} from "@/components/ui/my_table_default_column";
import { Invoice } from "@/entities/Invoice";
import {Product} from "@/entities/Product";
import { ReturnInvoiceServer } from "@/entities/ReturnInvoice";
import { ColumnDef } from "@tanstack/react-table";

export const returnDefaultVisibilityState = {
  id: true,
  invoiceId: true,
  createdAt: false,
  staffId: false,
  discountValue: true,
  returnFee: true,
  total: true,
  note: true,
  paymentMethod: false
  // TODO: MISSING CUSTOMER
}

export const returnColumnTitles = {
  id: "Return ID",
  invoiceId: "Invoice ID",
  createdAt: "Created At",
  staffId: "Staff ID",
  discountValue: "Discount",
  returnFee: "Return Fee",
  total: "Total",
  note: "Note",
  paymentMethod: "Payment Method"
};

export const returnTableColumns = (): ColumnDef<ReturnInvoiceServer>[] => {
  const columns: ColumnDef<ReturnInvoiceServer>[] = [
    defaultSelectColumn<ReturnInvoiceServer>(),
    defaultIndexColumn<ReturnInvoiceServer>(),
  ];

  for (let key in returnColumnTitles) {
    let col: ColumnDef<ReturnInvoiceServer>;
    col = defaultColumn<ReturnInvoiceServer>(key, returnColumnTitles);
    columns.push(col);
  }

  return columns;
};