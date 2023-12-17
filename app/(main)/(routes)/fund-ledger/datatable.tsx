"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";
import { DataTableContent } from "@/components/ui/my_table_content";
import { FormType, Transaction } from "@/entities/Transaction";
import { useAppSelector } from "@/hooks";
import { exportExcel, formatPrice } from "@/utils";
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
import { format } from "date-fns";
import { FileDown } from "lucide-react";
import * as React from "react";
import { ImportDailog } from "../../../../components/ui/my_import_dialog";
import { columnHeader, columns } from "./columns";
import { MakeExpenseDialog } from "./make_expense_dialog";
import { MakeReceiptDialog } from "./make_receipt_dialog";

type Props = {
  data: Transaction[];
  onSubmit: (values: Transaction) => void;
};

export function DataTable({ data, onSubmit }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
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

  const [selectedForm, setSelectedForm] = React.useState<Transaction | null>(
    null,
  );
  const [openExpense, setOpenExpense] = React.useState(false);
  const [openReceipt, setOpenReceipt] = React.useState(false);
  const staffList = useAppSelector((state) => state.staffs.value);
  const staffNameList = staffList.map((staff) => staff.name);

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
        const headerTitle = columnHeader[header as keyof typeof columnHeader];

        if (headerTitle === "#") {
          row = {
            ...row,
            [headerTitle]: index + 1,
          };
        } else if (header === "description") {
          const typePrefix =
            dataRow.formType === FormType.EXPENSE ? "Pay for" : "Receive from";
          const typeSubfix = dataRow.targetType;
          const type = `${typePrefix} ${typeSubfix}`;
          row = {
            ...row,
            [headerTitle]: type,
          };
        } else if (header === "value") {
          const value = dataRow[header as keyof typeof dataRow];
          const isExpense = dataRow["formType"] === FormType.EXPENSE;
          const expenseValue = "-" + value;
          const receiveValue = "+" + value;

          row = {
            ...row,
            [headerTitle]: isExpense ? expenseValue : receiveValue,
          };
        } else if (header === "createdDate") {
          const date = dataRow[header as keyof typeof dataRow];
          const dateStr = format(date, "dd/MM/yyyy HH:mm");
          row = {
            ...row,
            [headerTitle]: dateStr,
          };
        } else if (headerTitle !== undefined) {
          row = {
            ...row,
            [headerTitle]: dataRow[header as keyof typeof dataRow],
          };
        } else {
          console.log("header of undefined", header);
        }
      });
      console.log("Temp: ", row);
      return row;
    });

    exportExcel(toExport, "Fund Ledger", "Fund Ledger");
  };

  const handleImportFile = (sheets: any[]) => {
    const keys = Object.keys(columnHeader);
    const newData = sheets.map((sheet: any[]) => {
      const convertedSheet = sheet.map((row) => {
        console.log("row", row);
        let convertedRow: any = {};
        for (let key of keys) {
          const value =
            row[
              columnHeader[key as keyof typeof columnHeader] as keyof typeof row
            ];
          console.log("value", value);
          if (value === undefined) {
            convertedRow = { ...convertedRow, [key]: "" };
          } else {
            convertedRow = { ...convertedRow, [key]: value };
          }
        }
        return convertedRow;
      });
      console.log("convertedSheet", convertedSheet);
      return convertedSheet;
    });
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
          className="max-w-sm"
        />
        <div className="flex flex-row">
          <div className="mr-2">
            <Button
              variant="default"
              className="whitespace-nowrap"
              onClick={() => {
                setSelectedForm(null);
                setOpenReceipt(true);
              }}
            >
              Make Receipt
            </Button>
          </div>
          <div className="mr-2">
            <Button
              variant="default"
              className="whitespace-nowrap"
              onClick={() => {
                setSelectedForm(null);
                setOpenReceipt(true);
              }}
            >
              Make Expense
            </Button>
          </div>
          <div className="mr-2">
            <ImportDailog onImport={handleImportFile} />
          </div>

          <div className="mr-2">
            <Button variant={"green"} onClick={handleExportExcel}>
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
          <MakeExpenseDialog
            data={selectedForm}
            submit={handleSubmit}
            open={openExpense}
            setOpen={setOpenExpense}
            staffNameList={staffNameList}
          />
          <MakeReceiptDialog
            data={selectedForm}
            submit={handleSubmit}
            open={openReceipt}
            setOpen={setOpenReceipt}
            staffNameList={staffNameList}
          />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4 py-4">
        <div className="col-span-1 col-start-4 text-right">
          Beginning Fund <br />{" "}
          <span className="font-bold">{formatPrice(beginningFund)}</span>
        </div>
        <div className="col-span-1 col-start-5 text-right">
          Total Receipt <br />{" "}
          <span className="font-bold text-[#005ac3]">
            {formatPrice(totalExpense)}
          </span>
        </div>
        <div className="col-span-1 col-start-6 text-right">
          Total Expense <br />{" "}
          <span className="font-bold text-[#be1c26]">
            - {formatPrice(totalReceipt)}
          </span>
        </div>
        <div className="col-span-1 col-start-7 text-right">
          Remaining Fund <br />{" "}
          <span className="font-bold text-[green]">
            {formatPrice(beginningFund - (totalExpense - totalReceipt))}
          </span>
        </div>
      </div>
      <DataTableContent columns={columns} table={table} />
    </div>
  );
}
