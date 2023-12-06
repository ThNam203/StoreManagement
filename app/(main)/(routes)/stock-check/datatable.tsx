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
import { stockCheckColumnTitles, stockCheckTableColumns } from "./table_columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";
import { useAppSelector } from "@/hooks";
import { StockCheck } from "@/entities/StockCheck";

export function ProductPriceTablesDatatable() {
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
  const stockChecks = useAppSelector((state) => state.stockChecks.value)
  const columns = stockCheckTableColumns();

  const table = useReactTable<StockCheck>({
    data: stockChecks,
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
            columnHeaders={stockCheckColumnTitles}
          />
        </div>
      </div>
      <DataTableContent columns={columns} table={table} />
    </div>
  );
}
