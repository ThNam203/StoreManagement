"use client";

import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";
import { DataTableContent } from "@/components/ui/my_table_content";
import { Staff } from "@/entities/Staff";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { columnHeader, columns } from "./columns";
import { ImportForm } from "@/entities/ImportForm";
type Props = {
  data: ImportForm[];
  onSubmit?: (values: ImportForm) => void;
};

export function DataTable({ data, onSubmit }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: true,
      createdDate: false,
      updatedDate: true,
      supplier: true,
      branch: true,
      creator: false,
      quantity: false,
      itemQuantity: false,
      subTotal: false,
      discount: false,
      total: true,
      moneyGiven: false,
      change: false,
      note: false,
      status: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});
  const [filterInput, setFilterInput] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setFilterInput,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: filterInput,
    },
  });
  const handleSubmit = (values: ImportForm) => {
    if (onSubmit) onSubmit(values);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search anything..."
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-row space-x-2">
          <DataTableViewOptions
            table={table}
            title="Columns"
            columnHeaders={columnHeader}
          />
        </div>
      </div>
      <DataTableContent columns={columns} data={data} table={table} />
    </div>
  );
}
