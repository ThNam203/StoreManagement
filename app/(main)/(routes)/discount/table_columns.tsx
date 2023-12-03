"use client";

import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultColumn,
  defaultSelectColumn,
  defaultIndexColumn,
} from "@/components/ui/my_table_default_column";
import { Discount } from "@/entities/Discount";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ReactNode } from "react";

export const columnTitles = {
  id: "ID",
  name: "Discount Name",
  value: "Value",
  amount: "Amount Of Code",
  status: "Status",
  startDate: "Start Date",
  endDate: "End Date",
  createdAt: "Created Date",
  description: "Description",
};

export const discountTableColumns = (): ColumnDef<Discount>[] => {
  const columns: ColumnDef<Discount>[] = [
    defaultSelectColumn<Discount>(),
    defaultIndexColumn<Discount>(),
  ];

  for (let key in columnTitles) {
    let col: ColumnDef<Discount>;
    if (key === 'status') col = statusColumn(key, columnTitles)
    else col = defaultColumn<Discount>(key, columnTitles);
    columns.push(col);
  }

  return columns;
};

  function statusColumn(
    accessorKey: string,
    columnHeader: object,
    disableSorting: boolean = false
  ): ColumnDef<Discount> {
    const col: ColumnDef<Discount> = {
      accessorKey: accessorKey,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={columnHeader[accessorKey as keyof typeof columnHeader]}
        />
      ),
      cell: ({ row }) => {
        const value: ReactNode = row.getValue(accessorKey);
        const formatedValue: ReactNode = value ? "Active" : "Disabled"
        return <p className="text-[0.8rem]">{formatedValue}</p>;
      },
    };
    return col;
  }