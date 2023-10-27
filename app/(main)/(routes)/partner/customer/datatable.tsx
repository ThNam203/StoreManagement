"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { columnHeader, columns } from "./columns";
import { AddCustomerDialog } from "./add_customer_dialog";
import { Customer } from "@/entities/Customer";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";
import { DataTableContent } from "@/components/ui/my_table_content";
type Props = {
  data: Customer[];
  onSubmit: (values: Customer) => void;
};

export function DataTable({ data, onSubmit }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      "#": true,
      id: true,
      name: true,
      customerType: false,
      phoneNumber: true,
      address: false,
      sex: false,
      email: false,
      birthday: false,
      creator: false,
      createdDate: false,
      company: false,
      taxId: false,
      note: false,
      lastTransaction: false,
      debt: true,
      sale: true,
      finalSale: true,
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const handleSubmit = (values: Customer) => {
    if (onSubmit) onSubmit(values);
  };
  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex flex-row">
          <div className="mr-2">
            <AddCustomerDialog submit={handleSubmit} />
          </div>
          <DataTableViewOptions
            table={table}
            title="Columns"
            columnHeaders={columnHeader}
            cols={3}
            rowPerCols={7}
          />
        </div>
      </div>

      <DataTableContent columns={columns} data={data} table={table} />
    </div>
  );
}
