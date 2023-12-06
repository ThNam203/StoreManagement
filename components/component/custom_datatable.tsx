import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  Table as ReactTable,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { RefObject, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DataTableViewOptions } from "../ui/my_table_column_visibility_toggle";
import CustomDataTableContent from "./custom_datatable_content";
import { TabProps } from "./custom_datatable_row";
import LoadingCircle from "../ui/loading_circle";

type CustomDatatableProps<TData> = {
  data: TData[];
  visibilityConfig: {
    [key: string]: boolean;
  };
  columns: ColumnDef<TData>[];
  columnTitles: {
    [key: string]: string;
  };
  infoTabs: TabProps<TData>[];
  onDeleteRowsBtnClick: (dataToDelete: TData[]) => boolean;
};

export function CustomDatatable<TData>({
  data,
  visibilityConfig,
  columns,
  columnTitles,
  infoTabs,
  onDeleteRowsBtnClick,
}: CustomDatatableProps<TData>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(visibilityConfig);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [filterInput, setFilterInput] = useState("");

  const table = useReactTable<TData>({
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

  const [isDeletingCodes, setIsDeletingCodes] = useState(false);

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
          {table.getSelectedRowModel().rows.length > 0 ? (
            <Button
              variant={"red"}
              disabled={isDeletingCodes}
              onClick={() => {
                setIsDeletingCodes(true);
                if (
                  onDeleteRowsBtnClick(
                    table.getSelectedRowModel().rows.map((row) => row.original)
                  )
                ) {
                  table.toggleAllRowsSelected(false);
                }
                setIsDeletingCodes(false);
              }}
            >
              Delete{isDeletingCodes ? <LoadingCircle /> : null}
            </Button>
          ) : null}
          <div className="flex-1" />
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
      <CustomDataTableContent
        columns={columns}
        table={table}
        tableContainerRef={tableContainerRef}
        infoTabs={infoTabs}
      />
    </div>
  );
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  table: ReactTable<TData>;
  tableContainerRef: RefObject<HTMLDivElement>;
}
