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
import { MoreHorizontal } from "lucide-react";
import { StaffGroup } from "../props";

export const columns: ColumnDef<StaffGroup>[] = [
  {
    accessorKey: "id",
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
    accessorKey: "groupName",
    header: "Group Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("groupName")}</div>
    ),
  },
  {
    accessorKey: "group",
    header: "Group",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("group")}</div>
    ),
  },
  {
    accessorKey: "note",
    header: "Note",
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
