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
import { cn } from "@/lib/utils";

interface DataTableViewOptionsProps<TData> {
  title: string;
  table: Table<TData>;
  columnHeaders?: object;
  cols?: number;
  rowPerCols?: number;
}

function DataTableViewOptions<TData>({
  title,
  table,
  columnHeaders,
  cols = 2,
  rowPerCols,
}: DataTableViewOptionsProps<TData>) {
  const arrColIndex = Array.from(Array(cols).keys()); // this col start from 0
  if (rowPerCols === undefined)
    rowPerCols = table
      .getAllColumns()
      .filter((column) => column.getCanHide()).length / cols;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto whitespace-nowrap">
          {title} <Settings2 className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex flex-row space-x-2 justify-between"
      >
        {arrColIndex.map((col) => {
          return (
            <div key={col} className="flex flex-col">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column, index) => {
                  const headerContent =
                    columnHeaders !== undefined
                      ? columnHeaders[column.id as keyof typeof columnHeaders]
                      : column.id;

                  if (headerContent !== undefined) {
                    const colIndex = Math.floor(index / rowPerCols!);

                    if (colIndex === col) {
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
                          <Label className="cursor-pointer">
                            {headerContent}
                          </Label>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  } else {
                    return null;
                  }
                })}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { DataTableViewOptions };
