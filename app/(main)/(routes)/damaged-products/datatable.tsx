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
import { DamagedItem, columnTitles, tableColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";

export function ProductPriceTablesDatatable() {
  const [data, setData] = React.useState<DamagedItem[]>([
    {
      id: 1,
      value: "Product A",
      createdDate: new Date(),
      branch: "Main Store",
      creator: "John Smith",
      note: "Damaged during shipment",
      status: "In Progress",
    },
    {
      id: 2,
      value: "Product B",
      createdDate: new Date(),
      branch: "Downtown Store",
      creator: "Sarah Brown",
      note: "Customer return due to damage",
      status: "Completed",
    },
    {
      id: 3,
      value: "Product C",
      createdDate: new Date(),
      branch: "Suburb Store",
      creator: "Chris Anderson",
      note: "Received with manufacturing defect",
      status: "In Progress",
    },
    {
      id: 4,
      value: "Product D",
      createdDate: new Date(),
      branch: "Mall Store",
      creator: "Alex Davis",
      note: "Damaged in-store handling",
      status: "Canceled",
    },
    {
      id: 5,
      value: "Product E",
      createdDate: new Date(),
      branch: "Outlet Store",
      creator: "Ella Wright",
      note: "Defective product from supplier",
      status: "In Progress",
    },
  ]);

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    id: true,
    value: true,
    createdDate: true,
    branch: true,
    creator: true,
    note: true,
    status: true,
  })
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
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setFilterInput,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
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
        <div className="flex flex-row">
          <Button variant={"default"} onClick={() => {}}>
            Export Excel
          </Button>
          <DataTableViewOptions
            table={table}
            title="Columns"
            columnHeaders={columnTitles}
            cols={3}
            rowPerCols={7}
          />
        </div>
      </div>
      <DataTableContent columns={columns} data={data} table={table} />
    </div>
  );
}
