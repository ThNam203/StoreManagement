"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getColumns } from "@/components/ui/my_table_default_column";
import { Supplier } from "@/entities/Supplier";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown01,
  ArrowDown10,
  ArrowDownAz,
  ArrowDownZa,
  MoreHorizontal,
} from "lucide-react";

export const columnHeader = {
  id: "Supplier ID",
  name: "Supplier Name",
  phoneNumber: "Phone Number",
  supplierGroup: "Supplier Group",
  email: "Email",
  address: "Address",
  company: "Company",
  note: "Note",
  taxId: "Tax ID",
  creator: "Creator",
  createdDate: "Date Modified",
  debt: "Debt",
  sale: "Sale",
  totalSale: "Total Sale",
  status: "Status",
};

export const columns: ColumnDef<Supplier>[] =
  getColumns<Supplier>(columnHeader);
