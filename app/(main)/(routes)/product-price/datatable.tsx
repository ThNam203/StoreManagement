"use client";

import {
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { DataTableContent } from "@/components/ui/my_table_content";
import Product from "@/entities/Product";
import { columnTitles, tableColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";

export function ProductPriceTablesDatatable() {
  const [data, setData] = React.useState([
    {
      productId: 1,
      productName: "Bia333",
      originalPrice: 9000,
      generalPrice: 12000,
      blackFriday: 10000,
    },
    {
      productId: 1,
      productName: "Bia333",
      originalPrice: 9000,
      generalPrice: 12000,
      blackFriday: 10000,
    },
    {
      productId: 1,
      productName: "Bia333",
      originalPrice: 9000,
      generalPrice: 12000,
      blackFriday: 10000,
    },
    {
      productId: 1,
      productName: "Bia333",
      originalPrice: 9000,
      generalPrice: 12000,
      blackFriday: 10000,
    },
    {
      productId: 1,
      productName: "Bia333",
      originalPrice: 9000,
      generalPrice: 12000,
      blackFriday: 10000,
    },
    {
      productId: 1,
      productName: "Bia333",
      originalPrice: 9000,
      generalPrice: 12000,
      blackFriday: 10000,
    },
    {
      productId: 1,
      productName: "Bia333",
      originalPrice: 9000,
      generalPrice: 12000,
      blackFriday: 10000,
    },
    {
      productId: 1,
      productName: "Bia333",
      originalPrice: 9000,
      generalPrice: 12000,
      blackFriday: 10000,
    },
    {
      productId: 1,
      productName: "Bia333",
      originalPrice: 9000,
      generalPrice: 12000,
      blackFriday: 10000,
    },
    {
      productId: 1,
      productName: "Bia333",
      originalPrice: 9000,
      generalPrice: 12000,
      blackFriday: 10000,
    },
    {
      productId: 1,
      productName: "Bia333",
      originalPrice: 9000,
      generalPrice: 12000,
      blackFriday: 10000,
    },
    {
      productId: 1,
      productName: "Bia333",
      originalPrice: 9000,
      generalPrice: 12000,
      blackFriday: 10000,
    },
    {
      productId: 1,
      productName: "Bia333",
      originalPrice: 9000,
      generalPrice: 12000,
      blackFriday: 10000,
    },
    {
      productId: 1,
      productName: "Bia333",
      originalPrice: 9000,
      generalPrice: 12000,
      blackFriday: 10000,
    },
    {
      productId: 1,
      productName: "Bia333",
      originalPrice: 9000,
      generalPrice: 12000,
      blackFriday: 10000,
    },
    {
      productId: 1,
      productName: "Bia333",
      originalPrice: 9000,
      generalPrice: 12000,
      blackFriday: 10000,
    },
  ]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [filterInput, setFilterInput] = React.useState("");
  const columns = tableColumns();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        setData((prev) => prev.map((row, index) => index === rowIndex ? {
          ...prev[index],
          [columnId]: value,
        } : row));
      },
    },
    onGlobalFilterChange: setFilterInput,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter: filterInput,
    },
  });

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search anything..."
          value={filterInput}
          onChange={(event) => setFilterInput(event.target.value)}
          className="max-w-sm"
        />
        <div className="mr-2">
          <Button variant={"default"} onClick={() => {}}>
            Export Excel
          </Button>
        </div>
      </div>
      <DataTableContent columns={columns} data={data} table={table} />
    </div>
  );
}
