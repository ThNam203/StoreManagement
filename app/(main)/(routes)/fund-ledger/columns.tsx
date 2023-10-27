"use client";

import { getColumns } from "@/components/ui/my_table_default_column";
import { Transaction } from "@/entities/Transaction";
import { ColumnDef } from "@tanstack/react-table";

export const columnHeader = {
  "#": "#",
  id: "Form ID",
  createdDate: "Time",
  description: "Description",
  formType: "Form Type",
  value: "Value",
  creator: "Creator",
  transactionType: "Transaction Type",
  targetType: "Receiver/Payer Type",
  targetName: "Receiver/Payer",
  status: "Status",
  note: "Note",
};

export const columns: ColumnDef<Transaction>[] =
  getColumns<Transaction>(columnHeader);
