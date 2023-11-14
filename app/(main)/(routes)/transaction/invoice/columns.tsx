"use client";

import { getColumns } from "@/components/ui/my_table_default_column";
import { Invoice } from "@/entities/Invoice";
import { ColumnDef } from "@tanstack/react-table";

export const columnHeader = {
  id: "Invoice ID",
  customerId: "Customer ID",
  discount: "Discount",
  subtotal: "Original Price",
  total: "Total Price",
  moneyGiven: "Money Given",
  change: "Change",
  transactionType: "Transaction Type",
  createdDate: "Date Modified",
  creator: "Creator",
  VAT: "VAT",
};

export const columns: ColumnDef<Invoice>[] = getColumns<Invoice>(columnHeader);
