"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowDown01,
  ArrowDown10,
  ArrowDownAZ,
  ArrowDownZA,
  ArrowUp,
  MoreHorizontal,
} from "lucide-react";
import { FormType, Transaction } from "./entities";
import { formatPrice } from "./utils";

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <div
          className="w-[100px] flex flex-row hover:opacity-80 ease-linear duration-200 hover:cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          <span>Form ID</span>
          {column.getIsSorted() === false ? null : (
            <div>
              {column.getIsSorted() === "asc" ? (
                <ArrowDownAZ className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDownZA className="ml-2 h-4 w-4" />
              )}
            </div>
          )}
        </div>
      );
    },
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => {
      return (
        <div
          className="w-[100px] flex flex-row hover:opacity-80 ease-linear duration-200 hover:cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          <span>Time</span>
          {column.getIsSorted() === false ? null : (
            <div>
              {column.getIsSorted() === "asc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUp className="ml-2 h-4 w-4" />
              )}
            </div>
          )}
        </div>
      );
    },
    cell: ({ row }) => <div>{row.getValue("createdDate")}</div>,
  },
  {
    accessorKey: "formType",
    header: ({ column }) => {
      return (
        <div
          className="w-[150px] flex flex-row hover:opacity-80 ease-linear duration-200 hover:cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          <span>Type</span>
          {column.getIsSorted() === false ? null : (
            <div>
              {column.getIsSorted() === "asc" ? (
                <ArrowDownAZ className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDownZA className="ml-2 h-4 w-4" />
              )}
            </div>
          )}
        </div>
      );
    },
    cell: ({ row }) => <div>{row.getValue("formType")}</div>,
  },
  {
    accessorKey: "targetName",
    header: ({ column }) => {
      return (
        <div
          className="w-[100px] flex flex-row hover:opacity-80 ease-linear duration-200 hover:cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          <span>Receiver/Payer</span>
          {column.getIsSorted() === false ? null : (
            <div>
              {column.getIsSorted() === "asc" ? (
                <ArrowDownAZ className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDownZA className="ml-2 h-4 w-4" />
              )}
            </div>
          )}
        </div>
      );
    },
    cell: ({ row }) => <div>{row.getValue("targetName")}</div>,
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <div
          className="w-[100px] flex flex-row hover:opacity-80 ease-linear duration-200 hover:cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          <span>Value</span>
          {column.getIsSorted() === false ? null : (
            <div>
              {column.getIsSorted() === "asc" ? (
                <ArrowDown01 className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDown10 className="ml-2 h-4 w-4" />
              )}
            </div>
          )}
        </div>
      );
    },
    cell: ({ row }) => {
      const isExpense = row.getValue("formType") === FormType.EXPENSE;
      const className = isExpense ? "text-[#be1c26]" : "text-[green]";
      return (
        <div className={`font-bold + ${className}`}>
          {isExpense ? <span>-</span> : <span>+</span>}
          {formatPrice(row.getValue("value"))}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const rowData = row.original;

      const handleDeleteRow = (id: any) => {
        // Gửi request đến API để xóa row
      };

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
