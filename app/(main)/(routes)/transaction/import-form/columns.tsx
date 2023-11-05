"use client";

import { getColumns } from "@/components/ui/my_table_default_column";
import { ImportForm } from "@/entities/ImportForm";
import { Invoice } from "@/entities/Invoice";
import { ColumnDef } from "@tanstack/react-table";

export const columnHeader = {
  id: "Form ID",
  createdDate: "Date created",
  updatedDate: "Date updated",
  supplier: "Supplier",
  branch: "Branch",
  creator: "Creator",
  quantity: "Quantity",
  itemQuantity: "Item Quantity",
  subTotal: "Original Price",
  discount: "Discount",
  total: "Total Price",
  moneyGiven: "Money Given",
  change: "Money Change",
  note: "Note",
  status: "Status",
};

export const columns: ColumnDef<ImportForm>[] =
  getColumns<ImportForm>(columnHeader);
