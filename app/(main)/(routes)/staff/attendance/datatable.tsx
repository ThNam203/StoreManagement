"use client";

import { MyObjectCombobox } from "@/components/ui/my_combobox";
import { DataTableContent } from "@/components/ui/my_table_content";
import { BonusUnit, SalaryType } from "@/entities/SalarySetting";
import { Sex, Staff } from "@/entities/Staff";
import { formatID } from "@/utils";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Trash, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { set } from "date-fns";

export function DataTable({
  defaultData,
  staffList,
  onDataChange,
}: {
  defaultData?: Staff[];
  staffList: Staff[];
  onDataChange?: (data: Staff[]) => void;
}) {
  const [data, setData] = React.useState<Staff[]>(
    defaultData ? defaultData : []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: true,
      name: true,
      position: true,
    });
  const [rowSelection, setRowSelection] = React.useState({});
  const [filterInput, setFilterInput] = React.useState("");

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

  React.useEffect(() => {
    let selectedRows: Staff[] = [];
    table.getSelectedRowModel().rows.forEach((row) => {
      const staff = row.original as Staff;
      selectedRows.push(staff);
    });
    setSelectedStaff(selectedRows);
  }, [table.getSelectedRowModel()]);

  const [selectedStaff, setSelectedStaff] = React.useState<Staff[]>([]);

  React.useEffect(() => {
    if (onDataChange) onDataChange(data);
  }, [data]);

  const handleComboboxValuesChange = (values: Array<object>) => {
    setData(values as Staff[]);
  };
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between py-2">
        <MyObjectCombobox
          placeholder="Find staff..."
          choices={staffList}
          defaultValues={data}
          className="w-64"
          propToShow={["name", "id", "avatar"]}
          onValuesChange={handleComboboxValuesChange}
        />
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            className={cn(
              "flex items-center space-x-1",
              selectedStaff.length > 0 ? "visible" : "hidden"
            )}
            onClick={() => {
              const newData = data.filter(
                (staff) => !selectedStaff.includes(staff)
              );
              setData(newData);
              table.setRowSelection({});
            }}
          >
            <Trash size={16} />
            <span>Remove</span>
          </Button>
        </div>
      </div>
      <DataTableContent
        columns={columns}
        table={table}
        hasPagination={data.length > 10}
      />
    </div>
  );
}
