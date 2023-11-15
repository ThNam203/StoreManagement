"use client";

import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";
import { DataTableContent } from "@/components/ui/my_table_content";
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
import { Supplier } from "../../../../../entities/Supplier";
import { AddSupplierDialog } from "./add_supplier_dialog";
import { columnHeader, columns } from "./columns";
type Props = {
  data: Supplier[];
  onSubmit?: (values: Supplier) => void;
};

export function DataTable({ data, onSubmit }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [filterInput, setFilterInput] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: true,
      name: true,
      phoneNumber: true,
      supplierGroup: false,
      email: true,
      address: false,
      company: false,
      note: false,
      taxId: false,
      creator: false,
      createdDate: false,
      debt: true,
      sale: true,
      totalSale: false,
      status: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});

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

  const handleSubmit = (values: Supplier) => {
    if (onSubmit) onSubmit(values);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search anything..."
          value={filterInput}
          onChange={(event) => setFilterInput(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-row">
          <div className="mr-2">
            <AddSupplierDialog submit={handleSubmit} />
          </div>
          <DataTableViewOptions
            table={table}
            title="Columns"
            cols={2}
            columnHeaders={columnHeader}
          />
        </div>
      </div>
      <DataTableContent columns={columns} data={data} table={table} />
    </div>
  );
}
