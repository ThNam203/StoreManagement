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
  TableMeta,
} from "@tanstack/react-table";
import React, { RefObject, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DataTableViewOptions } from "../ui/my_table_column_visibility_toggle";
import CustomDataTableContent from "./custom_datatable_content";
import { TabProps } from "./custom_datatable_row";
import LoadingCircle from "../ui/loading_circle";
import { cn } from "@/lib/utils";
import { FileDown, FileUp } from "lucide-react";

export type DatatableConfig<TData> = {
  showDefaultSearchInput?: boolean;
  alternativeSearchInput?: JSX.Element;
  showDataTableViewOptions?: boolean;
  showRowSelectedCounter?: boolean;
  onDeleteRowsBtnClick?: (dataToDelete: TData[]) => Promise<any>; // if null, remove button
  onExportExcelBtnClick?: (table: ReactTable<TData>) => void; // if null, remove button
  onImportExcelBtnClick?: (table: ReactTable<TData>) => void; // if null, remove button
  defaultVisibilityState?: {
    [key: string]: boolean;
  };
  className?: string;
};

const defaultConfig: DatatableConfig<any> = {
  showDefaultSearchInput: true,
  alternativeSearchInput: undefined,
  showDataTableViewOptions: true,
  showRowSelectedCounter: true,
  defaultVisibilityState: {},
  onDeleteRowsBtnClick: undefined,
  onExportExcelBtnClick: undefined,
  onImportExcelBtnClick: undefined,
  className: "",
};

export type CustomDatatableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  columnTitles: {
    [key: string]: string;
  };
  infoTabs?: TabProps<TData>[];
  buttons?: JSX.Element[];
  config?: DatatableConfig<TData>;
  meta?: TableMeta<TData>;
};

export function CustomDatatable<TData>({
  data,
  columns,
  columnTitles,
  infoTabs,
  buttons,
  config,
  meta,
}: CustomDatatableProps<TData>) {
  config = { ...defaultConfig, ...config };

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    config?.defaultVisibilityState ?? {},
  );
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
    meta: meta,
  });

  const [isDeletingCodes, setIsDeletingCodes] = useState(false);

  return (
    <div ref={tableContainerRef} className="w-full space-y-2">
      <div
        className={cn(
          "flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-0",
          config.className,
        )}
      >
        {!config.showDefaultSearchInput ||
        config.alternativeSearchInput ? null : (
          <Input
            placeholder="Search anything..."
            value={filterInput}
            onChange={(event) => setFilterInput(event.target.value)}
            className="max-w-sm py-4"
          />
        )}
        {config.alternativeSearchInput}
        <div className="flex flex-row items-center gap-2">
          {config.onDeleteRowsBtnClick !== undefined &&
          table.getSelectedRowModel().rows.length > 0 ? (
            <Button
              variant={"red"}
              disabled={isDeletingCodes}
              onClick={() => {
                setIsDeletingCodes(true);
                config!.onDeleteRowsBtnClick!(
                  table.getSelectedRowModel().rows.map((row) => row.original),
                )
                  .then(() => table.toggleAllRowsSelected(false))
                  .finally(() => setIsDeletingCodes(false));
              }}
            >
              Delete{isDeletingCodes ? <LoadingCircle /> : null}
            </Button>
          ) : null}
          {buttons}
          {config.onImportExcelBtnClick !== undefined ? (
            <Button
              variant={"green"}
              className="gap-2"
              onClick={() => {
                config!.onImportExcelBtnClick!(table);
              }}
            >
              <FileUp className="h-4 w-4" />
              <span className="max-xl:hidden max-md:visible">Import</span>
            </Button>
          ) : null}
          {config.onExportExcelBtnClick !== undefined ? (
            <Button
              variant={"green"}
              className="gap-2"
              onClick={() => {
                config!.onExportExcelBtnClick!(table);
              }}
            >
              <FileDown size={16} />
              <span className="max-xl:hidden max-md:visible">Export</span>
            </Button>
          ) : null}

          {config.showDataTableViewOptions ? (
            <DataTableViewOptions
              title="Columns"
              table={table}
              columnHeaders={columnTitles}
            />
          ) : null}
        </div>
      </div>

      <CustomDataTableContent
        columns={columns}
        table={table}
        tableContainerRef={tableContainerRef}
        infoTabs={infoTabs}
        showRowSelectedCounter={!!config.showRowSelectedCounter}
      />
    </div>
  );
}

export const DefaultInformationCellDataTable = ({
  title,
  value,
}: {
  title: string;
  value: string | number | boolean;
}) => {
  return (
    <div className="mb-2 flex flex-row border-b font-medium">
      <p className="w-[120px] font-normal">{title}</p>
      <p>{value}</p>
    </div>
  );
};
