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
import { BalanceSheet, columnTitles, tableColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";

export function ProductPriceTablesDatatable() {
  const [data, setData] = React.useState<BalanceSheet[]>([
    {
      sheetId: 1,
      createdTime: new Date("2023-01-15T10:00:00"),
      balancedTime: new Date("2023-01-20T15:30:00"),
      actualNumber: 100,
      actualTotal: 5000,
      quantityDifference: 5,
      valueDifference: 250,
      creator: "John Doe",
      balancer: "Alice Smith",
      note: "Pending approval",
      status: "pending",
    },
    {
      sheetId: 2,
      createdTime: new Date("2023-02-10T08:45:00"),
      balancedTime: new Date("2023-02-15T14:15:00"),
      actualNumber: 150,
      actualTotal: 7500,
      quantityDifference: 10,
      valueDifference: 500,
      creator: "Jane Smith",
      balancer: "Bob Johnson",
      note: "Approved and completed",
      status: "done",
    },
    {
      sheetId: 3,
      createdTime: new Date("2023-03-05T11:20:00"),
      balancedTime: new Date("2023-03-10T16:45:00"),
      actualNumber: 75,
      actualTotal: 3750,
      quantityDifference: 3,
      valueDifference: 150,
      creator: "David Brown",
      balancer: "Ella Davis",
      note: "Pending approval",
      status: "pending",
    },
    {
      sheetId: 4,
      createdTime: new Date("2023-04-20T09:15:00"),
      balancedTime: new Date("2023-04-25T14:45:00"),
      actualNumber: 80,
      actualTotal: 4000,
      quantityDifference: 4,
      valueDifference: 200,
      creator: "Sarah Wilson",
      balancer: "Michael Lee",
      note: "Approved and completed",
      status: "done",
    },
    {
      sheetId: 5,
      createdTime: new Date("2023-05-15T11:30:00"),
      balancedTime: new Date("2023-05-20T16:00:00"),
      actualNumber: 120,
      actualTotal: 6000,
      quantityDifference: 6,
      valueDifference: 300,
      creator: "Oliver Johnson",
      balancer: "Emma White",
      note: "Pending approval",
      status: "pending",
    },
    {
      sheetId: 6,
      createdTime: new Date("2023-06-10T14:00:00"),
      balancedTime: new Date("2023-06-15T18:30:00"),
      actualNumber: 90,
      actualTotal: 4500,
      quantityDifference: 9,
      valueDifference: 450,
      creator: "Sophia Adams",
      balancer: "Daniel Turner",
      note: "Approved and completed",
      status: "done",
    },
    {
      sheetId: 7,
      createdTime: new Date("2023-07-05T10:45:00"),
      balancedTime: new Date("2023-07-10T15:15:00"),
      actualNumber: 70,
      actualTotal: 3500,
      quantityDifference: 7,
      valueDifference: 350,
      creator: "Liam Parker",
      balancer: "Chloe Hall",
      note: "Pending approval",
      status: "pending",
    },
    {
      sheetId: 8,
      createdTime: new Date("2023-08-01T08:00:00"),
      balancedTime: new Date("2023-08-05T12:30:00"),
      actualNumber: 110,
      actualTotal: 5500,
      quantityDifference: 11,
      valueDifference: 550,
      creator: "Aiden Bennett",
      balancer: "Grace Scott",
      note: "Approved and completed",
      status: "done",
    },
  ]);

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    sheetId: true,
    createdTime: true,
    balancedTime: true,
    actualNumber: true,
    actualTotal: true,
    quantityDifference: true,
    valueDifference: true,
    creator: true,
    balancer: true,
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
