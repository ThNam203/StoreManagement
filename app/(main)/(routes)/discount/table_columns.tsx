"use client";

import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultColumn,
  defaultSelectColumn,
  defaultIndexColumn,
} from "@/components/ui/my_table_default_column";
import { Discount } from "@/entities/Discount";
import { formatPrice } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ReactNode } from "react";

export const columnTitles = {
  id: "ID",
  name: "Discount Name",
  value: "Value",
  amount: "Amount Of Code",
  maxValue: "Max Value",
  minSubTotal: "Min Sub-Total",
  type: "Type",
  status: "Status",
  startDate: "Start Date",
  endDate: "End Date",
  description: "Description",
  createdAt: "Created Date",
};

export const discountTableColumns = (): ColumnDef<Discount>[] => {
  const columns: ColumnDef<Discount>[] = [
    defaultSelectColumn<Discount>(),
    defaultIndexColumn<Discount>(),
  ];

  for (let key in columnTitles) {
    let col: ColumnDef<Discount>;
    if (key === 'status') col = statusColumn(key, columnTitles)
    else if (key === 'value') col = valueColumn(key, columnTitles)
    else if (key === 'maxValue') col = maxValueColumn(key, columnTitles)
    else col = defaultColumn<Discount>(key, columnTitles);
    columns.push(col);
  }

  return columns;
};

  function valueColumn(
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
        const value: number = row.getValue(accessorKey);
        const type: "COUPON" | "VOUCHER" = row.getValue("type")
        return <p className="text-[0.8rem]">{value}{type === "COUPON" ? " %" : ""}</p>;
      },
    };
    return col;
  }

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

  function maxValueColumn(
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
        const value: number | null = row.getValue(accessorKey);
        if (value === null) return null
        return <p className="text-[0.8rem]">{formatPrice(value)}</p>;
      },
    };
    return col;
  }