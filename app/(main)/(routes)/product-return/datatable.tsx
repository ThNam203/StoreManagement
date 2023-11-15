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
import { ProductReturn, columnTitles, tableColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";

export function ProductPriceTablesDatatable() {
  const [data, setData] = React.useState<ProductReturn[]>([
    {
      id: 1,
      invoiceId: 12345,
      cashier: "John Doe",
      dateCreated: new Date(),
      customer: "Alice",
      branch: "Main Store",
      creator: "Jane Smith",
      note: "Returned items from the customer",
      totalReturnValue: 100.0,
      discount: 10.0,
      returnedAmount: 90.0,
      status: "Completed",
    },
    {
      id: 2,
      invoiceId: 12346,
      cashier: "Sarah Brown",
      dateCreated: new Date(),
      customer: "Bob",
      branch: "Downtown Store",
      creator: "Mike Johnson",
      note: "Refund for damaged products",
      totalReturnValue: 50.0,
      discount: 5.0,
      returnedAmount: 45.0,
      status: "Completed",
    },
    {
      id: 3,
      invoiceId: 12347,
      cashier: "Chris Anderson",
      dateCreated: new Date(),
      customer: "Eve",
      branch: "Suburb Store",
      creator: "Karen Wilson",
      note: "Exchange for a different size",
      totalReturnValue: 75.0,
      discount: 7.5,
      returnedAmount: 67.5,
      status: "In Progress",
    },
    {
      id: 4,
      invoiceId: 12348,
      cashier: "Alex Davis",
      dateCreated: new Date(),
      customer: "Grace",
      branch: "Mall Store",
      creator: "Olivia Adams",
      note: "Returned unused items",
      totalReturnValue: 30.0,
      discount: 3.0,
      returnedAmount: 27.0,
      status: "Canceled",
    },
    {
      id: 5,
      invoiceId: 12349,
      cashier: "Daniel Taylor",
      dateCreated: new Date(),
      customer: "Liam",
      branch: "Outlet Store",
      creator: "Sophia Lee",
      note: "Refund due to product defect",
      totalReturnValue: 20.0,
      discount: 2.0,
      returnedAmount: 18.0,
      status: "Completed",
    },
    {
      id: 6,
      invoiceId: 12350,
      cashier: "Ella Wright",
      dateCreated: new Date(),
      customer: "Noah",
      branch: "Online Store",
      creator: "Lucas Hall",
      note: "Returned items due to wrong color",
      totalReturnValue: 40.0,
      discount: 4.0,
      returnedAmount: 36.0,
      status: "In Progress",
    },
  ]);

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    id: true,
    invoiceId: true,
    cashier: true,
    dateCreated: true,
    customer: true,
    branch: true,
    creator: true,
    note: true,
    totalReturnValue: true,
    discount: true,
    returnedAmount: true,
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
