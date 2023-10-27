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
import { AddStaffDialog } from "./add_staff_dialog";
import { Staff } from "@/entities/Staff";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";
import { DataTablePagination } from "@/components/ui/my_table_pagination";
import { DataTableContent } from "@/components/ui/my_table_content";
type Props = {
  data: Staff[];
  onSubmit: (values: Staff) => void;
};

export function DataTable({ data, onSubmit }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      avatar: false,
      id: true,
      name: true,
      email: true,
      address: false,
      phoneNumber: true,
      note: false,
      sex: false,
      CCCD: false,
      birthday: false,
      createAt: false,
      branch: true,
      position: true,
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
  const handleSubmit = (values: Staff) => {
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
          <AddStaffDialog submit={handleSubmit} />
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
