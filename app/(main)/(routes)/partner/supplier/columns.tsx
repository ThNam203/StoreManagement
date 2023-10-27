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

const columnHeader = {
  id: "Supplier ID",
  name: "Supplier Name",
  phoneNumber: "Phone Number",
  address: "Address",
  email: "Email",
  supplierGroup: "Supplier Group",
  image: "Image",
  description: "Description",
  companyName: "Company Name",
  creator: "Creator",
  createdDate: "Date Modified",
  status: "Status",
  note: "Note",
};

export const columns: ColumnDef<Supplier>[] =
  getColumns<Supplier>(columnHeader);
