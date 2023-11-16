"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";
import { DataTableContent } from "@/components/ui/my_table_content";
import { FormType, Transaction } from "@/entities/Transaction";
import {
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { columnHeader, columns } from "./columns";
import { MakeExpenseDialog } from "./make_expense_dialog";
import { MakeReceiptDialog } from "./make_receipt_dialog";
import { exportExcel, formatPrice, importExcel } from "@/utils";
import { MyLabelButton } from "@/components/ui/my_label";
import { useToast } from "@/components/ui/use-toast";
import { ChevronDown, CopyIcon, FileDown, FileUp } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@radix-ui/react-dialog";
import { ImportDailog } from "../../../../components/ui/my_import_dialog";
import { join } from "path";

type Props = {
  data: Transaction[];
  onSubmit: (values: Transaction) => void;
};

export function DataTable({ data, onSubmit }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: true,
      createdDate: true,
      description: true,
      formType: false,
      transactionType: false,
      targetName: true,
      value: true,
      creator: false,
      targetType: false,
      status: false,
      note: false,
    });
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
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

  const handleSubmit = (values: Transaction) => {
    if (onSubmit) onSubmit(values);
  };
  //get header through id of column to export excel
  const handleExportExcel = () => {
    //get id of visible column in datatable
    const visibleColumnIds = table
      .getVisibleFlatColumns()
      .map((column) => column.id);

    //take list of header and value to export excel
    let toExport = data.map((dataRow, index) => {
      var row: object = {};
      visibleColumnIds.map((header) => {
        const headerContent = columnHeader[header as keyof typeof columnHeader];

        if (headerContent === "#") {
          row = {
            ...row,
            [headerContent]: index + 1,
          };
        } else if (header === "description") {
          const typePrefix =
            dataRow.formType === FormType.EXPENSE ? "Pay for" : "Receive from";
          const typeSubfix = dataRow.targetType;
          const type = `${typePrefix} ${typeSubfix}`;
          row = {
            ...row,
            [headerContent]: type,
          };
        } else if (header === "value") {
          const value = dataRow[header as keyof typeof dataRow];
          const isExpense = dataRow["formType"] === FormType.EXPENSE;
          const expenseValue = "-" + value;
          const receiveValue = "+" + value;

          row = {
            ...row,
            [headerContent]: isExpense ? expenseValue : receiveValue,
          };
        } else if (headerContent !== undefined) {
          row = {
            ...row,
            [headerContent]: dataRow[header as keyof typeof dataRow],
          };
        } else {
        }
      });
      return row;
    });

    exportExcel(toExport, "Fund Ledger", "Fund Ledger");
  };

  const beginningFund = 200000000;
  const totalExpense = 1500000;
  const totalReceipt = 1000000;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search anything..."
          value={filterInput}
          onChange={(event) => setFilterInput(event.target.value)}
          className="max-w-sm mr-2"
        />
        <div className="flex flex-row">
          <div className="mr-2">
            <MakeReceiptDialog submit={handleSubmit} />
          </div>
          <div className="mr-2">
            <MakeExpenseDialog submit={handleSubmit} />
          </div>
          <div className="mr-2">
            <ImportDailog />
          </div>

          <div className="mr-2">
            <Button
              variant={"default"}
              className="bg-lime-500 hover:bg-lime-600"
              onClick={handleExportExcel}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <DataTableViewOptions
            title="Columns"
            table={table}
            columnHeaders={columnHeader}
            cols={2}
            rowPerCols={6}
          />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4 py-4">
        <div className="col-start-4 col-span-1 text-right">
          Beginning Fund <br />{" "}
          <span className="font-bold">{formatPrice(beginningFund)}</span>
        </div>
        <div className="col-start-5 col-span-1 text-right">
          Total Receipt <br />{" "}
          <span className="text-[#005ac3] font-bold">
            {formatPrice(totalExpense)}
          </span>
        </div>
        <div className="col-start-6 col-span-1 text-right">
          Total Expense <br />{" "}
          <span className="text-[#be1c26] font-bold">
            - {formatPrice(totalReceipt)}
          </span>
        </div>
        <div className="col-start-7 col-span-1 text-right">
          Remaining Fund <br />{" "}
          <span className="text-[green] font-bold">
            {formatPrice(beginningFund - (totalExpense - totalReceipt))}
          </span>
        </div>
      </div>
      <DataTableContent columns={columns} data={data} table={table} />
    </div>
  );
}
