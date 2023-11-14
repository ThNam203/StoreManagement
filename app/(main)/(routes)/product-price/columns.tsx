"use client";

import { Input } from "@/components/ui/input";
import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultSelectColumn,
  defaultIndexColumn,
  defaultColumn,
} from "@/components/ui/my_table_default_column";
import Product from "@/entities/Product";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";

const editableCell = (cellCtx: any) => {
  const value = String(cellCtx.getValue());
  return (
    <input
      type="number"
      min={0}
      value={Number.parseInt(value)}
      onChange={(e) => {
        if (cellCtx.table.options.meta) {
          const meta: any = cellCtx.table.options.meta
          meta.updateData(cellCtx.row.index, cellCtx.column.id, e.target.value)
        }
      }}
      className="border-b border-blue-300 p-1 text-end bg-transparent w-[100px] text-[0.8px]"
    />
  );
}

function priceColumn(
  accessorKey: string,
  columnHeader: object,
  disableSorting: boolean = false
) {
  const col: ColumnDef<Product> = {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={columnHeader[accessorKey as keyof typeof columnHeader]}
      />
    ),
    cell: editableCell,
  };
  return col;
}

export const columnTitles = {
  originalPrice: "Original Price",
  generalPrice: "General Price",
  blackFriday: "Black Friday",
};

export const tableColumns = (): ColumnDef<any>[] => {
  const columns: ColumnDef<any>[] = [
    defaultSelectColumn<any>(),
    defaultIndexColumn<any>(),
    defaultColumn("productId", { productId: "Product Id" }),
    defaultColumn("productName", { productName: "Product Name" }),
  ];

  for (let key in columnTitles) {
    const col: ColumnDef<any> = priceColumn(key, columnTitles);
    columns.push(col);
  }

  return columns;
};
