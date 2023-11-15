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

export type PurchaseReturn = {
  id: number,
  createdDate: Date,
  supplier: string, // who sells goods initially for customer
  valueOfReturnedGoods: number,
  discount: number,
  amountSupplierNeedToPay: number,
  supplierPaid: number,
  note: string,
  status: string,
}

export const columnTitles = {
  id: 'Id',
  createdDate: 'Created Date',
  supplier: 'Supplier',
  valueOfReturnedGoods: 'Value Of Goods', 
  discount: 'Discount',
  amountSupplierNeedToPay: 'Amount To Return', 
  supplierPaid: 'Supplier Paid',
  note: 'Note',
  status: 'Status'
};

export const tableColumns = (): ColumnDef<PurchaseReturn>[] => {
  const columns: ColumnDef<PurchaseReturn>[] = [
    defaultSelectColumn<PurchaseReturn>(),
    defaultIndexColumn<PurchaseReturn>(),
  ];

  for (let key in columnTitles) {
    const col: ColumnDef<PurchaseReturn> = defaultColumn<PurchaseReturn>(key, columnTitles);
    columns.push(col);
  }

  return columns;
};
