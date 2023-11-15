"use client";

import { Input } from "@/components/ui/input";
import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultSelectColumn,
  defaultIndexColumn,
  defaultColumn,
} from "@/components/ui/my_table_default_column";
import Product from "@/entities/Product";
import { CellContext, ColumnDef } from "@tanstack/react-table";

export type ProductReturn = {
  id: number,
  invoiceId: number,
  cashier: string, // who sells goods initially for customer
  dateCreated: Date,
  customer: string,
  branch: string,
  creator: string,
  note: string,
  totalReturnValue: number,
  discount: number,
  returnedAmount: number,
  status: string,
}

export const columnTitles = {
  id: 'ID',
  invoiceId: 'Invoice ID',
  cashier: 'Invoice Cashier', // who sells goods initially for customer
  dateCreated: 'Created Date',
  customer: 'Customer',
  branch: 'Branch',
  creator: 'Creator',
  note: 'Note',
  totalReturnValue: 'Return Value',
  discount: 'Discount',
  returnedAmount: 'Returned Amount',
  status: 'Status',
};

export const tableColumns = (): ColumnDef<ProductReturn>[] => {
  const columns: ColumnDef<ProductReturn>[] = [
    defaultSelectColumn<ProductReturn>(),
    defaultIndexColumn<ProductReturn>(),
  ];

  for (let key in columnTitles) {
    const col: ColumnDef<ProductReturn> = defaultColumn<ProductReturn>(key, columnTitles);
    columns.push(col);
  }

  return columns;
};
