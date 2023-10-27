"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownAZ, ArrowDownZA, MoreHorizontal } from "lucide-react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Customer } from "@/entities/Customer";
import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import { getColumns } from "@/components/ui/my_table_default_column";

export const columnHeader = {
  id: "Customer ID",
  name: "Customer Name",
  customerType: "Customer Type",
  phoneNumber: "Phone Number",
  address: "Address",
  sex: "Sex",
  email: "Email",
  birthday: "Birthday",
  creator: "Creator",
  createdDate: "Date Modified",
  company: "Company",
  taxId: "Tax ID",
  note: "Note",
  lastTransaction: "Last Transaction",
  debt: "Debt",
  sale: "Sale",
  finalSale: "Final Sale",
  status: "Status",
};

export const columns: ColumnDef<Customer>[] =
  getColumns<Customer>(columnHeader);
