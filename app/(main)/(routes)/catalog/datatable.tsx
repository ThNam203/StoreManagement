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
import { Product } from "@/entities/Product";
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
import { ChevronRight, Lock, PenLine, Trash } from "lucide-react";
import { UpdateProductView } from "@/components/ui/catalog/update_product_form";
// import { DataTableContent } from "@/components/ui/my_table_content";

type Props = {
  data: Product[];
  onRowClicked: (rowIndex: number) => any;
  onProductUpdateButtonClicked: () => any;
};

export function CatalogDatatable({
  data,
  onRowClicked,
  onProductUpdateButtonClicked,
}: Props) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
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
        onRowClicked={onRowClicked}
        onProductUpdateButtonClicked={onProductUpdateButtonClicked}
      />
    </div>
  );
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  table: ReactTable<TData>;
  tableContainerRef: RefObject<HTMLDivElement>;
  onRowClicked: (rowIndex: number) => any;
  onProductUpdateButtonClicked: () => any;
}

function DataTableContent<TData, TValue>({
  columns,
  data,
  table,
  tableContainerRef,
  onRowClicked,
  onProductUpdateButtonClicked,
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
                    onRowClicked={onRowClicked}
                    onProductUpdateButtonClicked={onProductUpdateButtonClicked}
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
  onRowClicked,
  onProductUpdateButtonClicked,
}: {
  row: any;
  containerRef: RefObject<HTMLDivElement>;
  onRowClicked: (rowIndex: number) => any;
  onProductUpdateButtonClicked: () => any;
}) => {
  const [showInfoRow, setShowInfoRow] = React.useState(false);
  const product: Product = row.original;
  const [chosenImagePos, setChosenImagePos] = React.useState<number | null>(
    product.images.length > 0 ? 0 : null
  );

  const borderWidth =
    containerRef && containerRef.current
      ? Math.floor(containerRef.current?.getBoundingClientRect().width) -
        1 +
        "px"
      : "100%";

  return (
    <React.Fragment>
      <TableRow
        data-state={row.getIsSelected() && "selected"}
        onClick={(e) => {
          setShowInfoRow((prev) => !prev);
          onRowClicked(row.index);
        }}
        className={cn("hover:cursor-pointer relative")}
      >
        {row.getVisibleCells().map((cell: any) => (
          <TableCell
            key={cell.id}
            className={cn(
              "whitespace-nowrap",
              showInfoRow ? "font-semibold" : ""
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
        <td
          className={cn(
            "absolute left-0 right-0 bottom-0 top-0",
            showInfoRow ? "border-t-2 border-green-400" : "hidden"
          )}
        ></td>
      </TableRow>
      {showInfoRow ? (
        <>
          <tr className="hidden" />
          {/* maintain odd - even row */}
          <tr>
            <td colSpan={row.getVisibleCells().length} className="p-0">
              <div className={cn("p-2 border-b-2 border-green-400")}>
                <div
                  className="flex flex-col gap-4"
                  style={{ width: borderWidth }}
                >
                  <h4 className="text-lg font-bold text-blue-800">
                    {product.name}
                  </h4>
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col grow-[2] shrink-[2] gap-2 max-w-[300px]">
                      <AspectRatio
                        className="w-full flex items-center justify-center  border-2 border-gray-200 rounded-sm"
                        ratio={1 / 1}
                      >
                        <img
                          alt="product image"
                          src={
                            chosenImagePos !== null
                              ? product.images[chosenImagePos]
                              : "/default-product-img.jpg"
                          }
                          className="w-full max-h-[300px] max-w-[300px]"
                        />
                      </AspectRatio>
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
                                  src={imageLink ?? "/default-product-img.jpg"}
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
                        <div className="flex flex-row font-medium border-b mb-2">
                          <p className="w-[100px] font-normal">Product id:</p>
                          <p>{product.id}</p>
                        </div>
                        <div className="flex flex-row font-medium border-b mb-2">
                          <p className="w-[100px] font-normal">
                            Product group:
                          </p>
                          {product.productGroup ? (
                            <p>{product.productGroup}</p>
                          ) : null}
                        </div>
                        <div className="flex flex-row font-medium border-b mb-2">
                          <p className="w-[100px] font-normal">Brand:</p>
                          {product.productBrand ? (
                            <p>{product.productBrand}</p>
                          ) : null}
                        </div>
                        <div className="flex flex-row font-medium border-b mb-2">
                          <p className="w-[100px] font-normal">Stock:</p>
                          <p>{product.stock}</p>
                        </div>
                        <div className="flex flex-row font-medium border-b mb-2">
                          <p className="w-[100px] font-normal">Stock quota:</p>
                          <div className="flex flex-row items-center">
                            <p>{product.minStock}</p>
                            <ChevronRight size={14} className="mx-1 p-0" />
                            <p>{product.maxStock}</p>
                          </div>
                        </div>

                        <div className="flex flex-row font-medium border-b mb-2">
                          <p className="w-[100px] font-normal">
                            Product price:
                          </p>
                          <p>{product.productPrice}</p>
                        </div>
                        <div className="flex flex-row font-medium border-b mb-2">
                          <p className="w-[100px] font-normal">
                            Original price:
                          </p>
                          <p>{product.originalPrice}</p>
                        </div>
                        <div className="flex flex-row font-medium border-b mb-2">
                          <p className="w-[100px] font-normal">Weight:</p>
                          <p>{product.weight}</p>
                        </div>
                        <div className="flex flex-row font-medium border-b mb-2">
                          <p className="w-[100px] font-normal">Location:</p>
                          <p>{product.location}</p>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col pr-4">
                        <div className="flex flex-row font-medium border-b mb-2">
                          <p className="w-[100px] font-normal">Status:</p>
                          <p>{product.status}</p>
                        </div>
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
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex-1" />
                    <Button
                      variant={"green"}
                      onClick={(e) => onProductUpdateButtonClicked()}
                    >
                      <PenLine size={16} fill="white" className="mr-2" />
                      Update
                    </Button>
                    <Button variant={"red"}>
                      <Lock size={16} className="mr-2" />
                      Disable product
                    </Button>
                    <Button variant={"red"}>
                      <Trash size={16} className="mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </>
      ) : null}
    </React.Fragment>
  );
};
