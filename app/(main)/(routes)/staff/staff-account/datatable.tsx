"use client";

import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";
import { Staff } from "@/entities/Staff";
import {
  ColumnDef,
  ColumnFiltersState,
  Table as ReactTable,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AddStaffDialog } from "./add_staff_dialog";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/ui/my_table_pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalaryUnitTable } from "@/entities/SalarySetting";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils";
import { format } from "date-fns";
import { PenLine, Trash } from "lucide-react";
import Image from "next/image";
import React, { RefObject, useRef, useState } from "react";
import { columnHeader, getStaffColumns } from "./columns";

export function DataTable({
  data,
  onSubmit,
  onStaffDeleteButtonClicked,
}: {
  data: Staff[];
  onSubmit: (values: Staff, avatar: File | null) => any;
  onStaffDeleteButtonClicked: (rowIndex: number) => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      avatar: true,
      id: true,
      name: true,
      phoneNumber: true,
      CCCD: false,
      salaryDebt: true,
      note: false,
      birthday: false,
      sex: false,
      email: true,
      address: false,
      position: true,
      createAt: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});
  const [filterInput, setFilterInput] = React.useState("");
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [openStaffDialog, setOpenStaffDialog] = useState(false);
  const handleOpenStaffDialog = (staff: Staff | null) => {
    setSelectedStaff(staff ? staff : null);
    setOpenStaffDialog(true);
  };
  const handleSubmit = (values: Staff, avatar: File | null) => {
    if (onSubmit) {
      return onSubmit(values, avatar);
    }
  };
  const onStaffUpdateButtonClicked = (rowIndex: number) => {
    handleOpenStaffDialog(data[rowIndex]);
  };
  const columns: ColumnDef<Staff>[] = getStaffColumns();
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

  return (
    <div ref={tableContainerRef} className="w-full space-y-2">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search anything..."
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-row space-x-2">
          <Button variant="green" onClick={() => handleOpenStaffDialog(null)}>
            Add new staff
          </Button>

          <DataTableViewOptions
            table={table}
            title="Columns"
            columnHeaders={columnHeader}
          />
        </div>
      </div>
      <DataTableContent
        columns={columns}
        table={table}
        tableContainerRef={tableContainerRef}
        onStaffUpdateButtonClicked={onStaffUpdateButtonClicked}
        onStaffDeleteButtonClicked={onStaffDeleteButtonClicked}
      />
      <AddStaffDialog
        open={openStaffDialog}
        setOpen={setOpenStaffDialog}
        submit={handleSubmit}
        data={selectedStaff}
      />
    </div>
  );
}

function DataTableContent<TData, TValue>({
  columns,
  table,
  tableContainerRef,
  onStaffUpdateButtonClicked,
  onStaffDeleteButtonClicked,
}: {
  columns: ColumnDef<TData, TValue>[];
  table: ReactTable<TData>;
  tableContainerRef: RefObject<HTMLDivElement>;
  onStaffUpdateButtonClicked: (rowIndex: number) => any;
  onStaffDeleteButtonClicked: (rowIndex: number) => any;
}) {
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
                  <CustomRow
                    key={row.id}
                    row={row}
                    containerRef={tableContainerRef}
                    onStaffUpdateButtonClicked={onStaffUpdateButtonClicked}
                    onStaffDeleteButtonClicked={onStaffDeleteButtonClicked}
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

const CustomRow = ({
  row,
  containerRef,
  onStaffUpdateButtonClicked,
  onStaffDeleteButtonClicked,
}: {
  row: any;
  containerRef: RefObject<HTMLDivElement>;
  onStaffUpdateButtonClicked: (rowIndex: number) => any;
  onStaffDeleteButtonClicked: (rowIndex: number) => any;
}) => {
  const [showInfoRow, setShowInfoRow] = React.useState(false);
  const staff: Staff = row.original;

  const borderWidth =
    containerRef && containerRef.current
      ? Math.floor(containerRef.current?.getBoundingClientRect().width) -
        1 +
        "px"
      : "100%";

  return (
    <React.Fragment>
      <TableRow
        data-state={row.getIsSelected() && "selected"}
        onDoubleClick={(e) => {
          setShowInfoRow((prev) => !prev);
        }}
        className={cn("hover:cursor-pointer relative")}
      >
        {row.getVisibleCells().map((cell: any) => (
          <TableCell
            key={cell.id}
            className={cn(
              "whitespace-nowrap",
              showInfoRow ? "font-semibold bg-green-200" : ""
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
        <td
          className={cn(
            "absolute left-0 right-0 bottom-0 top-0",
            showInfoRow ? "border-t-2 border-green-400" : "hidden"
          )}
        ></td>
      </TableRow>
      {showInfoRow ? (
        <>
          <tr className="hidden" />
          {/* maintain odd - even row */}
          <tr>
            <td colSpan={row.getVisibleCells().length} className="p-0">
              <div className={cn("border-b-2 border-green-400")}>
                <Tabs
                  defaultValue="info"
                  style={{
                    width: borderWidth,
                  }}
                >
                  <TabsList className="w-full py-2 px-4 flex flex-row items-center justify-start">
                    <TabsTrigger value="info">Infomation</TabsTrigger>
                    <TabsTrigger value="work-schedule">
                      Work schedule
                    </TabsTrigger>
                    <TabsTrigger value="salary-setting">
                      Salary setting
                    </TabsTrigger>
                    <TabsTrigger value="salary-debt">Salary Debt</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info">
                    <div className="h-[300px] py-2 px-4 flex flex-col gap-4">
                      <div className="flex flex-row">
                        <div className="flex flex-col grow-[5] shrink-[5] max-w-[200px] max-h-[350px]">
                          <AspectRatio
                            className={cn(
                              "w-[150px] h-[200px] rounded-sm",
                              staff.avatar !== null && staff.avatar !== ""
                                ? "border-2 border-black"
                                : ""
                            )}
                            ratio={1 / 1}
                          >
                            <Image
                              width={0}
                              height={0}
                              sizes="100vw"
                              alt={`${staff.name} avatar`}
                              src={
                                staff.avatar !== null && staff.avatar !== ""
                                  ? staff.avatar
                                  : "/default-user-avatar.png"
                              }
                              className="w-full h-full border rounded-sm"
                            />
                          </AspectRatio>
                        </div>
                        <div className="flex flex-row grow-[5] shrink-[5] text-[0.8rem] gap-2">
                          <div className="flex-1 flex flex-col">
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">Staff ID:</p>
                              <p>{staff.id}</p>
                            </div>
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">
                                Staff name:
                              </p>
                              <p>{staff.name}</p>
                            </div>
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">Birthday:</p>
                              <p>{format(staff.birthday, "dd/MM/yyyy")}</p>
                            </div>
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">Sex:</p>
                              <p>{staff.sex}</p>
                            </div>
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">CCCD:</p>
                              <p>{staff.cccd}</p>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col">
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">Position:</p>
                              <p>{staff.position}</p>
                            </div>
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">
                                Phone number:
                              </p>
                              <p>{staff.phoneNumber}</p>
                            </div>
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">Email:</p>
                              <p>{staff.email}</p>
                            </div>
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">Address:</p>
                              <p>{staff.address}</p>
                            </div>
                            <div>
                              <p className="mb-2">Note: </p>
                              <textarea
                                readOnly
                                disabled
                                className={cn(
                                  "resize-none border-2 p-1 h-[80px] w-full"
                                )}
                                defaultValue={staff.note}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <div className="flex-1" />
                        <Button
                          variant={"green"}
                          onClick={(e) => onStaffUpdateButtonClicked(row.index)}
                        >
                          <PenLine size={16} fill="white" className="mr-2" />
                          Update
                        </Button>
                        <Button
                          variant={"red"}
                          onClick={() => onStaffDeleteButtonClicked(row.index)}
                        >
                          <Trash size={16} className="mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="work-schedule">
                    <div className="h-[300px] py-2 px-4 flex flex-col gap-4">
                      <div className="flex flex-row">
                        <div className="flex flex-col grow-[5] shrink-[5] max-w-[200px] max-h-[350px]">
                          <AspectRatio
                            className={cn(
                              "w-[150px] h-[200px] rounded-sm",
                              staff.avatar !== null && staff.avatar !== ""
                                ? "border-2 border-black"
                                : ""
                            )}
                            ratio={1 / 1}
                          >
                            <Image
                              width={0}
                              height={0}
                              sizes="100vw"
                              alt={`${staff.name} avatar`}
                              src={
                                staff.avatar !== null && staff.avatar !== ""
                                  ? staff.avatar
                                  : "/default-user-avatar.png"
                              }
                              className="w-full h-full border rounded-sm"
                            />
                          </AspectRatio>
                        </div>
                        <div className="flex flex-row grow-[5] shrink-[5] text-[0.8rem] gap-2">
                          <div className="flex-1 flex flex-col">
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">Staff ID:</p>
                              <p>{staff.id}</p>
                            </div>
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">
                                Staff name:
                              </p>
                              <p>{staff.name}</p>
                            </div>
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">Birthday:</p>
                              <p>{format(staff.birthday, "dd/MM/yyyy")}</p>
                            </div>
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">Sex:</p>
                              <p>{staff.sex}</p>
                            </div>
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">CCCD:</p>
                              <p>{staff.cccd}</p>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col">
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">Position:</p>
                              <p>{staff.position}</p>
                            </div>
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">
                                Phone number:
                              </p>
                              <p>{staff.phoneNumber}</p>
                            </div>
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">Email:</p>
                              <p>{staff.email}</p>
                            </div>
                            <div className="flex flex-row font-medium border-b mb-2">
                              <p className="w-[100px] font-normal">Address:</p>
                              <p>{staff.address}</p>
                            </div>
                            <div>
                              <p className="mb-2">Note: </p>
                              <textarea
                                readOnly
                                disabled
                                className={cn(
                                  "resize-none border-2 p-1 h-[80px] w-full"
                                )}
                                defaultValue={staff.note}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <div className="flex-1" />
                        <Button
                          variant={"green"}
                          onClick={(e) => onStaffUpdateButtonClicked(row.index)}
                        >
                          <PenLine size={16} fill="white" className="mr-2" />
                          Update
                        </Button>
                        <Button
                          variant={"red"}
                          onClick={() => onStaffDeleteButtonClicked(row.index)}
                        >
                          <Trash size={16} className="mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="salary-setting">
                    <div className="h-[300px] py-2 pr-4 pl-8 flex flex-col gap-4 justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-row font-medium text-xs border-b mb-2">
                          <p className="w-[100px] font-normal">
                            Payroll period:
                          </p>
                          <p>Monthly</p>
                        </div>
                        <div className="flex flex-row font-medium text-xs border-b mb-2">
                          <p className="w-[100px] font-normal">Salary type:</p>
                          <p>{`${staff.salarySetting.salaryType} (${formatPrice(
                            staff.salarySetting.salary
                          )} VND / ${
                            SalaryUnitTable[staff.salarySetting.salaryType]
                          })`}</p>
                        </div>
                      </div>

                      <div className="flex flex-row items-center gap-2">
                        <div className="flex-1" />
                        <Button
                          variant={"green"}
                          onClick={(e) => onStaffUpdateButtonClicked(row.index)}
                        >
                          <PenLine size={16} fill="white" className="mr-2" />
                          Update
                        </Button>
                        <Button
                          variant={"red"}
                          onClick={() => onStaffDeleteButtonClicked(row.index)}
                        >
                          <Trash size={16} className="mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="salary-debt">Salary debt tab</TabsContent>
                </Tabs>
              </div>
            </td>
          </tr>
        </>
      ) : null}
    </React.Fragment>
  );
};
