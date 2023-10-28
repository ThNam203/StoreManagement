import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./my_table_column_header";
import { Checkbox } from "@radix-ui/react-checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./button";

function defaultColumn<T>(
  accessorKey: string,
  columnHeader: object,
  disableSorting: boolean = false
): ColumnDef<T> {
  const col: ColumnDef<T> = {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={columnHeader[accessorKey as keyof typeof columnHeader]}
      />
    ),
    cell: ({ row }) => <div>{row.getValue(accessorKey)}</div>,
  };
  return col;
}

function getColumns<T>(columnHeader: object): ColumnDef<T>[] {
  const columns: ColumnDef<T>[] = [
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
  ];
  for (let key in columnHeader) {
    const col: ColumnDef<T> = defaultColumn<T>(key, columnHeader);
    columns.push(col);
  }
  const lastCol: ColumnDef<T> = {
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
  };
  columns.push(lastCol);
  return columns;
}

export { defaultColumn, getColumns };
