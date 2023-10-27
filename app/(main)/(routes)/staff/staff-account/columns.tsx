"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import { getColumns } from "@/components/ui/my_table_default_column";
import { Staff } from "@/entities/Staff";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown01,
  ArrowDown10,
  ArrowDownAZ,
  ArrowDownZA,
  MoreHorizontal,
} from "lucide-react";

export const columnHeader = {
  avatar: "Avatar",
  id: "Staff ID",
  name: "Staff Name",
  email: "Email",
  address: "Address",
  phoneNumber: "Phone Number",
  note: "Note",
  sex: "Sex",
  CCCD: "CCCD",
  birthday: "Birthday",
  createAt: "Date Modified",
  branch: "Branch",
  position: "Position",
};

export const columns: ColumnDef<Staff>[] = getColumns<Staff>(columnHeader);
