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
import { ArrowDownAZ, ArrowDownZA, MoreHorizontal } from "lucide-react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Customer } from "@/entities/Customer";
import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";

export const columnHeader = {
  "#": "#",
  id: "Customer ID",
  name: "Customer Name",
  customerType: "Customer Type",
  phoneNumber: "Phone Number",
  address: "Address",
  sex: "Sex",
  email: "Email",
  birthday: "Birthday",
  creator: "Creator",
  createdDate: "Date Modified",
  company: "Company",
  taxId: "Tax ID",
  note: "Note",
  lastTransaction: "Last Transaction",
  debt: "Debt",
  sale: "Sale",
  finalSale: "Final Sale",
  status: "Status",
};

export const columns: ColumnDef<Customer>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["name"]} />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "customerType",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={columnHeader["customerType"]}
      />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("customerType")}</div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={columnHeader["phoneNumber"]}
        disableSorting
      />
    ),
    cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
  },

  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["address"]} />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("address")}</div>
    ),
  },
  {
    accessorKey: "sex",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["sex"]} />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("sex")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["email"]} />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "birthday",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["birthday"]} />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("birthday")}</div>
    ),
  },
  {
    accessorKey: "creator",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["creator"]} />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("creator")}</div>
    ),
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={columnHeader["createdDate"]}
      />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("createdDate")}</div>
    ),
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["company"]} />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("company")}</div>
    ),
  },
  {
    accessorKey: "taxId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["taxId"]} />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("taxId")}</div>
    ),
  },
  {
    accessorKey: "note",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["note"]} />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("note")}</div>,
  },
  {
    accessorKey: "lastTransaction",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={columnHeader["lastTransaction"]}
      />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("lastTransaction")}</div>
    ),
  },
  {
    accessorKey: "debt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["debt"]} />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("debt")}</div>,
  },
  {
    accessorKey: "sale",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["sale"]} />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("sale")}</div>,
  },
  {
    accessorKey: "finalSale",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={columnHeader["finalSale"]}
      />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("finalSale")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeader["status"]} />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(rowData.id)}
              >
                Copy Customer ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(rowData.name)}
              >
                Copy Customer Name
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(rowData.address)}
              >
                Copy Customer Address
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />
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
