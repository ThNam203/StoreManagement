"use client";

import {
  defaultColumn,
  defaultSelectColumn,
  defaultIndexColumn,
} from "@/components/ui/my_table_default_column";
import { Invoice } from "@/entities/Invoice";
import {Product} from "@/entities/Product";
import { ColumnDef } from "@tanstack/react-table";

export const invoiceDefaultVisibilityState = {
    id: true,
    cash: false,
    changed: false,
    subTotal: false,
    discountValue: true,
    total: true,
    paymentMethod: false,
    discountCode: false,
    customerId: true,
    staffId: true,
    createdAt: true,
}

export const invoiceColumnTitles = {
  id: "Invoice ID",
  cash: "Paid",
  changed: "Change",
  subTotal: "Sub-Total",
  discountValue: "Discount Value",
  total: "Total",
  paymentMethod: "Payment Method",
  discountCode: "Discount Code",
  customerId: "Customer Id",
  staffId: "Staff Id",
  createdAt: "Created At",
};

export const invoiceTableColumns = (): ColumnDef<Invoice>[] => {
  const columns: ColumnDef<Invoice>[] = [
    defaultSelectColumn<Invoice>(),
    defaultIndexColumn<Invoice>(),
  ];

  for (let key in invoiceColumnTitles) {
    let col: ColumnDef<Invoice>;
    col = defaultColumn<Invoice>(key, invoiceColumnTitles);
    columns.push(col);
  }

  return columns;
};