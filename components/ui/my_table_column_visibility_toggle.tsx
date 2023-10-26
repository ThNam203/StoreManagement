"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "./checkbox";
import { Settings2 } from "lucide-react";
import { Label } from "./label";

interface DataTableViewOptionsProps<TData> {
  title: string;
  table: Table<TData>;
  columnHeaders?: object;
}

export function DataTableViewOptions<TData>({
  title,
  table,
  columnHeaders,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto whitespace-nowrap">
          {title} <Settings2 className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col p-2">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            const headerContent =
              columnHeaders !== undefined
                ? columnHeaders[column.id as keyof typeof columnHeaders]
                : column.id;
            if (headerContent !== undefined)
              return (
                <div
                  className="flex flex-row items-center space-x-2 p-2 rounded-md select-none hover:cursor-pointer hover:bg-[#f5f5f4] ease-linear duration-100"
                  key={column.id}
                  onClick={() =>
                    column.toggleVisibility(!column.getIsVisible())
                  }
                >
                  <Checkbox
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  ></Checkbox>
                  <Label className="cursor-pointer">{headerContent}</Label>
                </div>
              );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
