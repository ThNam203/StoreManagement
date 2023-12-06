import {
  ColumnFiltersState,
  ColumnDef,
  RowSelectionState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as ReactTable,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefObject } from "react";
import CustomDatatableRow, { TabProps } from "./custom_datatable_row";
import { DataTablePagination } from "../ui/my_table_pagination";

interface CustomDataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  table: ReactTable<TData>;
  tableContainerRef: RefObject<HTMLDivElement>;
  infoTabs: TabProps<TData>[],
}

export default function CustomDataTableContent<TData>({
  columns,
  table,
  tableContainerRef,
  infoTabs
}: CustomDataTableProps<TData>) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.map((row, idx) => (
                  <CustomDatatableRow
                    key={row.id}
                    row={row}
                    containerRef={tableContainerRef}
                    tabs={infoTabs}
                  />
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
