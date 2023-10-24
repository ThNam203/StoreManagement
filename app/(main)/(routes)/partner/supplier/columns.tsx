"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown01,
  ArrowDown10,
  ArrowDownAz,
  ArrowDownZa,
  MoreHorizontal,
} from "lucide-react";
import { Supplier } from "../entities";

export const columns: ColumnDef<Supplier>[] = [
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
    header: "ID",
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div
          className="w-[140px] flex flex-row hover:opacity-80 ease-linear duration-200 hover:cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          <span>Supplier Name</span>
          {column.getIsSorted() === false ? null : (
            <div>
              {column.getIsSorted() === "asc" ? (
                <ArrowDownAz className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDownZa className="ml-2 h-4 w-4" />
              )}
            </div>
          )}
        </div>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div
          className="w-[120px] flex flex-row hover:opacity-80 ease-linear duration-200 hover:cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          <span>Email</span>
          {column.getIsSorted() === false ? null : (
            <div>
              {column.getIsSorted() === "asc" ? (
                <ArrowDownAz className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDownZa className="ml-2 h-4 w-4" />
              )}
            </div>
          )}
        </div>
      );
    },
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "debt",
    header: ({ column }) => {
      return (
        <div
          className="w-fit flex flex-row hover:opacity-80 ease-linear duration-200 hover:cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          <span>Debt</span>
        </div>
      );
    },
    cell: ({ row }) => <div className="text-center">0</div>,
  },
  {
    accessorKey: "totalBuy",
    header: ({ column }) => {
      return (
        <div
          className="w-fit flex flex-row hover:opacity-80 ease-linear duration-200 hover:cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          <span>Total Buy</span>
        </div>
      );
    },
    cell: ({ row }) => <div className="text-center">0</div>,
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