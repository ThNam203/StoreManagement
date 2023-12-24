"use client";

import {
  defaultColumn,
  defaultIndexColumn,
  defaultSelectColumn,
  getColumns,
} from "@/components/ui/my_table_default_column";
import { Transaction } from "@/entities/Transaction";
import { ColumnDef } from "@tanstack/react-table";

export const fundledgerColumnTitles = {
  id: "Form ID",
  time: "Time",
  description: "Description",
  creator: "Creator",
  transactionType: "Transaction type",
  targetName: "Receiver/Payer",
  status: "Status",
  value: "Value",
  note: "Note",
};

export const fundledgerDefaultVisibilityState = {
  id: true,
  time: true,
  description: true,
  creator: false,
  transactionType: false,
  targetName: true,
  status: false,
  value: true,
  note: false,
};

export const fundledgerTableColumns = (): ColumnDef<Transaction>[] => {
  const columns: ColumnDef<Transaction>[] = [
    defaultSelectColumn<Transaction>(),
    defaultIndexColumn<Transaction>(),
  ];

  for (let key in fundledgerColumnTitles) {
    let col: ColumnDef<Transaction>;
    col = defaultColumn<Transaction>(key, fundledgerColumnTitles);
    columns.push(col);
  }

  return columns;
};
