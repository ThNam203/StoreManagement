"use client";

import { getColumns } from "@/components/ui/my_table_default_column";
import { Staff } from "@/entities/Staff";
import { ColumnDef } from "@tanstack/react-table";

export const columnHeader = {
  id: "Staff ID",
  name: "Staff Name",
  position: "Position",
};

export const columns: ColumnDef<Staff>[] = getColumns<Staff>(
  columnHeader,
  false
);
