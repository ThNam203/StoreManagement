"use client";

import {
  defaultColumn,
  defaultSelectColumn,
  defaultIndexColumn,
} from "@/components/ui/my_table_default_column";
import { Supplier } from "@/entities/Supplier";
import { ColumnDef } from "@tanstack/react-table";

export const supplierDefaultVisibilityState = {
  id: true,
  name: true,
  address: true,
  phoneNumber: true,
  email: true,
  description: false,
  companyName: false,
  status: false,
  supplierGroupName: false,
};

export const supplierColumnTitles = {
  id: "Supplier ID",
  name: "Name",
  address: "Address",
  phoneNumber: "Phone Number",
  email: "Email",
  description: "Description",
  companyName: "Company",
  status: "Status",
  supplierGroupName: "Supplier Group",
};

export const supplierTableColumns = (): ColumnDef<Supplier>[] => {
  const columns: ColumnDef<Supplier>[] = [
    defaultSelectColumn<Supplier>(),
    defaultIndexColumn<Supplier>(),
  ];

  for (let key in supplierColumnTitles) {
    let col: ColumnDef<Supplier>;
    col = defaultColumn<Supplier>(key, supplierColumnTitles);
    columns.push(col);
  }

  return columns;
};
