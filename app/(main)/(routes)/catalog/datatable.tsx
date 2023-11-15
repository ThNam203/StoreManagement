/* eslint-disable @next/next/no-img-element */
"use client";
import scrollbar_style from "@/styles/scrollbar.module.css";
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as ReactTable,
  flexRender,
} from "@tanstack/react-table";
import Product from "@/entities/Product";
import { columnTitles, productTableColumns } from "./table_columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { Ref, RefObject, useEffect, useRef, useState } from "react";
import { DataTablePagination } from "@/components/ui/my_table_pagination";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
// import { DataTableContent } from "@/components/ui/my_table_content";

type Props = {
  data: Product[];
  onSubmit?: (values: Product) => void;
};

export function CatalogDatatable({ data }: Props) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: true,
      name: true,
      barcode: false,
      location: false,
      originalPrice: true,
      productPrice: true,
      stock: true,
      status: true,
      description: true,
      note: true,
      minStock: false,
      maxStock: false,
      productGroup: false,
      productBrand: false,
      productProperties: false,
      images: true,
      salesUnits: false,
      weight: false,
    });
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [filterInput, setFilterInput] = React.useState("");
  const columns = productTableColumns();

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

  return (
    <div ref={tableContainerRef} className="w-full space-y-2">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search anything..."
          value={filterInput}
          onChange={(event) => setFilterInput(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-row">
          <div className="mr-2">
            <Button variant={"default"} onClick={() => {}}>
              Export Excel
            </Button>
          </div>

          <DataTableViewOptions
            title="Columns"
            table={table}
            columnHeaders={columnTitles}
          />
        </div>
      </div>
      <DataTableContent
        columns={columns}
        data={data}
        table={table}
        tableContainerRef={tableContainerRef}
      />
    </div>
  );
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  table: ReactTable<TData>;
  tableContainerRef: RefObject<HTMLDivElement>;
}

function DataTableContent<TData, TValue>({
  columns,
  data,
  table,
  tableContainerRef,
}: DataTableProps<TData, TValue>) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.map((row, idx) => (
                  <CustomRow
                    key={row.id}
                    row={row}
                    containerRef={tableContainerRef}
                  />
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

const CustomRow = ({
  row,
  containerRef,
}: {
  row: any;
  containerRef: RefObject<HTMLDivElement>;
}) => {
  const [showInfoRow, setShowInfoRow] = React.useState(false);
  const product: Product = row.original;
  const [chosenImagePos, setChosenImagePos] = React.useState<number | null>(
    null
  );

  return (
    <React.Fragment>
      <TableRow
        data-state={row.getIsSelected() && "selected"}
        onClick={(e) => {
          setShowInfoRow((prev) => !prev);
        }}
        className={cn("hover:cursor-pointer relative")}
      >
        {row.getVisibleCells().map((cell: any) => (
          <TableCell key={cell.id} className="whitespace-nowrap">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
        <td
          className={cn(
            "absolute left-0 right-0 bottom-0 top-0",
            showInfoRow ? "border-2 border-b-0 border-green-400" : "hidden"
          )}
          style={{
            width: containerRef!.current
              ? Math.floor(containerRef.current?.getBoundingClientRect().width) - 0.125 * parseFloat(getComputedStyle(document.documentElement).fontSize) + "px"
              : "100%",
          }}
        ></td>
      </TableRow>
      {showInfoRow ? (
        <>
          <tr className="hidden" /> {/* maintain odd - even row */}
          <tr>
            <td colSpan={row.getVisibleCells().length} className="p-0">
              <div
                className={cn(
                  "table-fixed p-2 flex flex-col gap-4 border-2 border-t-0 border-green-400"
                )}
                style={{
                  width: containerRef!.current
                    ? Math.floor(containerRef.current?.getBoundingClientRect().width) - 0.125 * parseFloat(getComputedStyle(document.documentElement).fontSize) + "px"
                    : "100%",
                }}
              >
                <h4 className="text-lg font-bold text-blue-800">
                  {product.name}
                </h4>
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col grow-[2] shrink-[2] gap-2 max-w-[300px]">
                    <img
                      alt="product image"
                      src={
                        chosenImagePos
                          ? product.images[chosenImagePos]
                          : "/default-product-img.jpg"
                      }
                      className="w-full max-h-[300px] max-w-[300px] border-2 border-gray-200 rounded-sm"
                    />
                    {product.images.length > 0 ? (
                      <div className="flex flex-row gap-2">
                        {product.images.map((imageLink, idx) => {
                          return (
                            <div
                              className={cn(
                                "max-h-[53px] max-w-[60px] border",
                                chosenImagePos === idx
                                  ? "border-black"
                                  : "border-gray-200"
                              )}
                              key={idx}
                              onClick={(_) => setChosenImagePos(idx)}
                            >
                              <img
                                alt="product image preview"
                                src={"/default-product-img.jpg"}
                                className="object-contain mb-1"
                              />
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-row grow-[5] shrink-[5] text-[0.8rem]">
                    <div className="flex-1 flex flex-col pr-4">
                      <p className="font-medium border-b mb-2">
                        <span className="w-[100px] inline-block font-normal">
                          Product id:
                        </span>
                        {product.id}
                      </p>
                      <p className="font-medium border-b mb-2">
                        <span className="w-[100px] inline-block font-normal">
                          Product group:
                        </span>
                        {product.productGroup}
                      </p>
                      <p className="font-medium border-b mb-2">
                        <span className="w-[100px] inline-block font-normal">
                          Brand:
                        </span>
                        {product.productBrand}
                      </p>
                      <p className="font-medium border-b mb-2">
                        <span className="w-[100px] inline-block font-normal">
                          Stock:
                        </span>
                        {product.stock}
                      </p>
                      <p className="font-medium border-b mb-2">
                        <span className="w-[100px] inline-block font-normal">
                          Stock quota:
                        </span>
                        {product.minStock}
                        <ChevronRight
                          size={16}
                          className="inline-block font-normal"
                        />
                        {product.maxStock}
                      </p>
                      <p className="font-medium border-b mb-2">
                        <span className="w-[100px] inline-block font-normal">
                          Product price:
                        </span>
                        {product.productPrice}
                      </p>
                      <p className="font-medium border-b mb-2">
                        <span className="w-[100px] inline-block font-normal">
                          Original price:
                        </span>
                        {product.originalPrice}
                      </p>
                      <p className="font-medium border-b mb-2">
                        <span className="w-[100px] inline-block font-normal">
                          Weight:
                        </span>
                        {product.weight}
                      </p>
                      <p className="font-medium border-b mb-2">
                        <span className="w-[100px] inline-block font-normal">
                          Location:
                        </span>
                        {product.location}
                      </p>
                    </div>
                    <div className="flex-1 flex flex-col pr-4">
                      <p className="font-medium border-b mb-2">
                        <span className="w-[100px] inline-block font-normal">
                          Status:
                        </span>
                        {product.status}
                      </p>
                      <div>
                        <p className="mb-2">Description</p>
                        <textarea
                          readOnly
                          className={cn(
                            "resize-none border-2 rounded-sm p-1 h-[80px] w-full",
                            scrollbar_style.scrollbar
                          )}
                          defaultValue={product.description}
                        ></textarea>
                      </div>
                      <div>
                        <p className="mb-2">Note</p>
                        <textarea
                          readOnly
                          className={cn(
                            "resize-none border-2 rounded-sm p-1 h-[80px] w-full",
                            scrollbar_style.scrollbar
                          )}
                          defaultValue={product.note}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Button variant={"green"}>Update</Button>
                </div>
              </div>
            </td>
          </tr>
        </>
      ) : null}
    </React.Fragment>
  );
};
