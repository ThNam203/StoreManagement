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
import { PurchaseReturn, columnTitles, tableColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";

export function ProductPriceTablesDatatable() {
  const [data, setData] = React.useState<PurchaseReturn[]>([
    {
      id: 1,
      createdDate: new Date(),
      supplier: "ABC Suppliers",
      valueOfReturnedGoods: 500.0,
      discount: 50.0,
      amountSupplierNeedToPay: 450.0,
      supplierPaid: 450.0,
      note: "Returned damaged products",
      status: "Completed",
    },
    {
      id: 2,
      createdDate: new Date(),
      supplier: "XYZ Distributors",
      valueOfReturnedGoods: 750.0,
      discount: 75.0,
      amountSupplierNeedToPay: 675.0,
      supplierPaid: 675.0,
      note: "Refund for overstocked items",
      status: "In Progress",
    },
    {
      id: 3,
      createdDate: new Date(),
      supplier: "LMN Wholesalers",
      valueOfReturnedGoods: 300.0,
      discount: 30.0,
      amountSupplierNeedToPay: 270.0,
      supplierPaid: 270.0,
      note: "Exchange for different product",
      status: "Completed",
    },
    {
      id: 4,
      createdDate: new Date(),
      supplier: "PQR Imports",
      valueOfReturnedGoods: 200.0,
      discount: 20.0,
      amountSupplierNeedToPay: 180.0,
      supplierPaid: 180.0,
      note: "Returned unused items",
      status: "Canceled",
    },
    {
      id: 5,
      createdDate: new Date(),
      supplier: "RST Wholesales",
      valueOfReturnedGoods: 400.0,
      discount: 40.0,
      amountSupplierNeedToPay: 360.0,
      supplierPaid: 360.0,
      note: "Refund due to product defect",
      status: "Completed",
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
