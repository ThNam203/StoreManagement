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
import {
  FormType,
  Status,
  TargetType,
  Transaction,
  TransactionType,
} from "@/entities/Transaction";
import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";

export const columnTitles = {
  image: '',
  product_id: 'ID',
  barcode: 'Barcode',
  product_name: 'Name',
  product_group: 'Product group',
  
};

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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["id"]} />
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={columnHeader["createdDate"]}
      />
    ),
    cell: ({ row }) => <div>{row.getValue("createdDate")}</div>,
  },
  {
    accessorKey: "creator",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["creator"]} />
    ),
    cell: ({ row }) => <div>{row.getValue("creator")}</div>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={columnHeader["description"]}
      />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("description")}</div>;
    },
  },
  {
    accessorKey: "formType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["formType"]} />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("formType")}</div>;
    },
  },
  {
    accessorKey: "transactionType",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={columnHeader["transactionType"]}
      />
    ),
    cell: ({ row }) => <div>{row.getValue("transactionType")}</div>,
  },
  {
    accessorKey: "targetType",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={columnHeader["targetType"]}
      />
    ),
    cell: ({ row }) => <div>{row.getValue("targetType")}</div>,
  },
  {
    accessorKey: "targetName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={columnHeader["targetName"]}
      />
    ),
    cell: ({ row }) => <div>{row.getValue("targetName")}</div>,
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["value"]} />
    ),
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
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["status"]} />
    ),
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
  {
    accessorKey: "note",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["note"]} />
    ),
    cell: ({ row }) => <div>{row.getValue("note")}</div>,
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
