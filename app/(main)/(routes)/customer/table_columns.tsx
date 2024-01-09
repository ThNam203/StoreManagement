"use client";

import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultColumn,
  defaultSelectColumn,
  defaultIndexColumn,
} from "@/components/ui/my_table_default_column";
import { Customer } from "@/entities/Customer";
import { ColumnDef } from "@tanstack/react-table";

export const customerDefaultVisibilityState = {
  id: true,
  name: true,
  customerGroup: false,
  phoneNumber: true,
  address: false,
  creatorId: false,
  sex: false,
  email: true,
  birthday: false,
  createdAt: false,
  description: true,
}

export const customerColumnTitles = {
  id: "ID",
  name: "Name",
  customerGroup: "Group",
  phoneNumber: "Phone Number",
  address: "Address",
  sex: "Sex",
  email: "Email",
  creatorId: "Creator Id",
  birthday: "Birthday",
  createdAt: "Created Date",
  description: "Description",
};

export const customerTableColumns = (): ColumnDef<Customer>[] => {
  const columns: ColumnDef<Customer>[] = [
    defaultSelectColumn<Customer>(),
    defaultIndexColumn<Customer>(),
  ];

  for (let key in customerColumnTitles) {
    columns.push(defaultColumn<Customer>(key, customerColumnTitles))
  }

  return columns;
};