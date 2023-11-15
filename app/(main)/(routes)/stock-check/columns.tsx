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

export type BalanceSheet = {
  sheetId: number,
  createdTime: Date,
  balancedTime: Date,
  actualNumber: number,
  actualTotal: number,
  quantityDifference: number,
  valueDifference: number,
  creator: string,
  balancer: string,
  note: string,
  status: "pending" | "done",
}

export const columnTitles = {
  sheetId: "Sheet Id",
  createdTime: "Created Time",
  balancedTime: "Balanced Time",
  actualNumber: "Actual Number",
  actualTotal: "Actual Total",
  quantityDifference: "Quantity Difference",
  valueDifference: "Value Difference",
  creator: "Sheet creator",
  balancer: "Balancer",
  note: "Note",
  status: "Status",
};

export const tableColumns = (): ColumnDef<BalanceSheet>[] => {
  const columns: ColumnDef<BalanceSheet>[] = [
    defaultSelectColumn<BalanceSheet>(),
    defaultIndexColumn<BalanceSheet>(),
  ];

  for (let key in columnTitles) {
    const col: ColumnDef<BalanceSheet> = defaultColumn<BalanceSheet>(key, columnTitles);
    columns.push(col);
  }

  return columns;
};
