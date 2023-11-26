"use client";

import { getColumns } from "@/components/ui/my_table_default_column";
import { Staff } from "@/entities/Staff";
import { ColumnDef } from "@tanstack/react-table";

export const columnHeader = {
  avatar: "Avatar",
  id: "Staff ID",
  name: "Staff Name",
  phoneNumber: "Phone Number",
  CCCD: "CCCD",
  salaryDebt: "Salary Debt",
  note: "Note",
  birthday: "Birthday",
  sex: "Sex",
  email: "Email",
  address: "Address",
  position: "Position",
  createAt: "Date Created",
};

export const columns: ColumnDef<Staff>[] = getColumns<Staff>(
  columnHeader,
  true
);
