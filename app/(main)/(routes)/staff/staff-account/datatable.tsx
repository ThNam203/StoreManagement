"use client";

import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";
import { Paycheck, Staff, WorkSchedule } from "@/entities/Staff";
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
import { format, set } from "date-fns";
import { Calculator, PenLine, Trash } from "lucide-react";
import Image from "next/image";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { columnHeader, getStaffColumns } from "./columns";
import { useAppSelector } from "@/hooks";
import { DailyShift } from "@/entities/Attendance";
import {
  ConfirmDialogType,
  MyConfirmDialog,
} from "../../../../../components/ui/my_confirm_dialog";
import LoadingCircle from "@/components/ui/loading_circle";
import StaffService from "@/services/staff_service";
import { useToast } from "@/components/ui/use-toast";
import { axiosUIErrorHandler } from "@/services/axios_utils";

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
    [],
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
  const handleCalculateSalary = async (rowIndex: number) => {
    try {
      const res = await StaffService.calculateSalary(data[rowIndex].id);
      const salaryDebt = res.data.salaryDebt;
      data[rowIndex].salaryDebt = salaryDebt;
      return Promise.resolve();
    } catch (e) {
      console.log(e);
      return Promise.reject();
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
        onStaffCalculateSalaryButtonClicked={handleCalculateSalary}
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
  onStaffCalculateSalaryButtonClicked,
  onStaffUpdateButtonClicked,
  onStaffDeleteButtonClicked,
}: {
  columns: ColumnDef<TData, TValue>[];
  table: ReactTable<TData>;
  tableContainerRef: RefObject<HTMLDivElement>;
  onStaffCalculateSalaryButtonClicked: (rowIndex: number) => any;
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
                            header.getContext(),
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
                    onStaffCalculateSalaryButtonClicked={
                      onStaffCalculateSalaryButtonClicked
                    }
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
  onStaffCalculateSalaryButtonClicked,
  onStaffUpdateButtonClicked,
  onStaffDeleteButtonClicked,
}: {
  row: any;
  containerRef: RefObject<HTMLDivElement>;
  onStaffCalculateSalaryButtonClicked: (rowIndex: number) => any;
  onStaffUpdateButtonClicked: (rowIndex: number) => any;
  onStaffDeleteButtonClicked: (rowIndex: number) => any;
}) => {
  const { toast } = useToast();
  const [showInfoRow, setShowInfoRow] = React.useState(false);
  const staff: Staff = row.original;
  const [paycheckList, setPaycheckList] = React.useState<Paycheck[]>([
    {
      id: 1,
      workingPeriod: {
        startDate: new Date(2023, 10, 1),
        endDate: new Date(2023, 10, 30),
      },
      totalSalary: 0,
      paid: 0,
      needToPay: 0,
    },
  ]);
  const [isRemoving, setIsRemoving] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [contentConfirmDialog, setContentConfirmDialog] = useState({
    title: "",
    content: "",
    type: "warning" as ConfirmDialogType,
  });
  const shiftList = useAppSelector((state) => state.shift.value);
  const [workScheduleList, setWorkScheduleList] = useState<WorkSchedule[]>([]);
  useEffect(() => {
    let tempWorkScheduleList: WorkSchedule[] = [];
    shiftList.forEach((shift) => {
      shift.dailyShiftList.forEach((dailyShift) => {
        dailyShift.attendList.forEach((attend) => {
          if (attend.staffId === staff.id) {
            const workSchedule: WorkSchedule = {
              date: dailyShift.date,
              shiftName: shift.name,
              startTime: shift.workingTime.start,
              endTime: shift.workingTime.end,
              note: attend.note,
            };
            tempWorkScheduleList.push(workSchedule);
          }
        });
      });
    });
    setWorkScheduleList(tempWorkScheduleList);
  }, [shiftList]);

  const borderWidth =
    containerRef && containerRef.current
      ? Math.floor(containerRef.current?.getBoundingClientRect().width) -
        1 +
        "px"
      : "100%";

  const handleRemoveStaff = async () => {
    setIsRemoving(true);
    try {
      await onStaffDeleteButtonClicked(row.index);
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject(e);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <React.Fragment>
      <TableRow
        data-state={row.getIsSelected() && "selected"}
        onDoubleClick={(e) => {
          setShowInfoRow((prev) => !prev);
        }}
        className={cn("relative hover:cursor-pointer")}
      >
        {row.getVisibleCells().map((cell: any) => (
          <TableCell
            key={cell.id}
            className={cn(
              "whitespace-nowrap",
              showInfoRow ? "bg-green-200 font-semibold" : "",
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
        <td
          className={cn(
            "absolute bottom-0 left-0 right-0 top-0",
            showInfoRow ? "border-t-2 border-green-400" : "hidden",
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
                  <TabsList className="flex w-full flex-row items-center justify-start px-4 py-2">
                    <TabsTrigger value="info">Infomation</TabsTrigger>
                    <TabsTrigger value="work-schedule">
                      Work schedule
                    </TabsTrigger>
                    <TabsTrigger value="salary-setting">
                      Salary setting
                    </TabsTrigger>
                    <TabsTrigger value="paycheck">Paycheck</TabsTrigger>
                    <TabsTrigger value="salary-debt">Salary Debt</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info">
                    <div className="flex h-[300px] flex-col gap-4 px-4 py-2">
                      <div className="flex flex-row">
                        <div className="flex max-h-[350px] max-w-[200px] shrink-[5] grow-[5] flex-col">
                          <AspectRatio
                            className={cn(
                              "h-[200px] w-[150px] rounded-sm",
                              staff.avatar !== null && staff.avatar !== ""
                                ? "border-2 border-black"
                                : "",
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
                              className="h-full w-full rounded-sm border"
                            />
                          </AspectRatio>
                        </div>
                        <div className="flex shrink-[5] grow-[5] flex-row gap-2 text-[0.8rem]">
                          <div className="flex flex-1 flex-col">
                            <div className="mb-2 flex flex-row border-b font-medium">
                              <p className="w-[100px] font-normal">Staff ID:</p>
                              <p>{staff.id}</p>
                            </div>
                            <div className="mb-2 flex flex-row border-b font-medium">
                              <p className="w-[100px] font-normal">
                                Staff name:
                              </p>
                              <p>{staff.name}</p>
                            </div>
                            <div className="mb-2 flex flex-row border-b font-medium">
                              <p className="w-[100px] font-normal">Birthday:</p>
                              <p>{format(staff.birthday, "dd/MM/yyyy")}</p>
                            </div>
                            <div className="mb-2 flex flex-row border-b font-medium">
                              <p className="w-[100px] font-normal">Sex:</p>
                              <p>{staff.sex}</p>
                            </div>
                            <div className="mb-2 flex flex-row border-b font-medium">
                              <p className="w-[100px] font-normal">CCCD:</p>
                              <p>{staff.cccd}</p>
                            </div>
                          </div>
                          <div className="flex flex-1 flex-col">
                            <div className="mb-2 flex flex-row border-b font-medium">
                              <p className="w-[100px] font-normal">Position:</p>
                              <p>{staff.position}</p>
                            </div>
                            <div className="mb-2 flex flex-row border-b font-medium">
                              <p className="w-[100px] font-normal">
                                Phone number:
                              </p>
                              <p>{staff.phoneNumber}</p>
                            </div>
                            <div className="mb-2 flex flex-row border-b font-medium">
                              <p className="w-[100px] font-normal">Email:</p>
                              <p>{staff.email}</p>
                            </div>
                            <div className="mb-2 flex flex-row border-b font-medium">
                              <p className="w-[100px] font-normal">Address:</p>
                              <p>{staff.address}</p>
                            </div>
                            <div>
                              <p className="mb-2">Note: </p>
                              <textarea
                                readOnly
                                disabled
                                className={cn(
                                  "h-[80px] w-full resize-none border-2 p-1",
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
                          onClick={() => {
                            setContentConfirmDialog({
                              title: "Remove staff",
                              content: `All data of this staff will be removed. Are you sure you want to remove staff named '${staff.name}' ?`,
                              type: "warning",
                            });
                            setOpenConfirmDialog(true);
                          }}
                        >
                          <Trash size={16} className="mr-2" />
                          Remove
                          {isRemoving && <LoadingCircle></LoadingCircle>}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="work-schedule">
                    <div className="flex h-[300px] flex-col justify-between gap-4 py-2 pl-8 pr-4">
                      <div className="w-full overflow-hidden rounded-md">
                        <div className="flex w-full flex-row items-center justify-start gap-2 bg-blue-100 p-2">
                          <span className="w-[150px] text-sm font-semibold">
                            Date
                          </span>
                          <span className="w-[150px] text-sm font-semibold">
                            Shift
                          </span>
                          <span className="w-[150px] text-center text-sm font-semibold">
                            Start
                          </span>
                          <span className="w-[150px] text-center text-sm font-semibold">
                            End
                          </span>
                          <span className="w-[250px] text-center text-sm font-semibold">
                            Note
                          </span>
                        </div>

                        {workScheduleList.map((workSchedule, index) => {
                          return (
                            <div
                              key={index}
                              className={cn(
                                "flex w-full flex-row items-center justify-start gap-2 p-2",
                                index % 2 === 0 ? "bg-gray-100" : "bg-white",
                              )}
                            >
                              <span className="w-[150px] text-sm font-semibold">
                                {format(workSchedule.date, "dd/MM/yyyy")}
                              </span>
                              <span className="w-[150px] text-sm">
                                {workSchedule.shiftName}
                              </span>
                              <span className="w-[150px] text-center text-sm">
                                {format(workSchedule.startTime, "HH:mm")}
                              </span>
                              <span className="w-[150px] text-center text-sm">
                                {format(workSchedule.endTime, "HH:mm")}
                              </span>
                              <span className="w-[250px] text-center text-sm">
                                {workSchedule.note}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="salary-setting">
                    <div className="flex h-[300px] flex-col justify-between gap-4 py-2 pl-8 pr-4">
                      <div className="flex flex-col gap-1">
                        <div className="mb-2 flex flex-row border-b text-xs font-medium">
                          <p className="w-[100px] font-normal">
                            Payroll period:
                          </p>
                          <p>Monthly</p>
                        </div>
                        <div className="mb-2 flex flex-row border-b text-xs font-medium">
                          <p className="w-[100px] font-normal">Salary type:</p>
                          <p>{`${staff.salarySetting.salaryType} (${formatPrice(
                            staff.salarySetting.salary,
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
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="paycheck">
                    <div className="flex h-[300px] flex-col justify-between gap-4 py-2 pl-8 pr-4">
                      <div className="w-full overflow-hidden rounded-md">
                        <div className="flex w-full flex-row items-center justify-start gap-2 bg-blue-100 p-2">
                          <span className="w-[150px] text-sm font-semibold">
                            Form ID
                          </span>
                          <span className="w-[250px] text-sm font-semibold">
                            Working period
                          </span>
                          <span className="w-[150px] text-right text-sm font-semibold">
                            Total salary
                          </span>
                          <span className="w-[250px] text-right text-sm font-semibold">
                            Paid
                          </span>
                          <span className="w-[250px] text-right text-sm font-semibold">
                            Need to pay
                          </span>
                        </div>
                        {paycheckList.map((paycheck, index) => {
                          return (
                            <div
                              key={index}
                              className="flex w-full flex-row items-center justify-start gap-2 bg-gray-100 p-2"
                            >
                              <span className="w-[150px] text-sm font-semibold">
                                {paycheck.id}
                              </span>
                              <span className="w-[250px] text-sm">
                                {format(
                                  paycheck.workingPeriod.startDate,
                                  "dd/MM/yyyy",
                                )}{" "}
                                -{" "}
                                {format(
                                  paycheck.workingPeriod.endDate,
                                  "dd/MM/yyyy",
                                )}
                              </span>
                              <span className="w-[150px] text-right text-sm">
                                {formatPrice(paycheck.totalSalary)}
                              </span>
                              <span className="w-[250px] text-right text-sm">
                                {formatPrice(paycheck.paid)}
                              </span>
                              <span className="w-[250px] text-right text-sm">
                                {formatPrice(paycheck.needToPay)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <div className="flex-1" />
                        <Button
                          variant={"green"}
                          onClick={(e) =>
                            onStaffCalculateSalaryButtonClicked(row.index)
                          }
                        >
                          <Calculator size={16} className="mr-2" />
                          Calculate salary
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="salary-debt">
                    <div className="flex h-[300px] flex-col justify-between gap-4 py-2 pl-8 pr-4">
                      <div className="w-full overflow-hidden rounded-md">
                        <div className="flex w-full flex-row items-center justify-start gap-2 bg-blue-100 p-2">
                          <span className="w-[150px] text-sm font-semibold">
                            Form ID
                          </span>
                          <span className="w-[250px] text-sm font-semibold">
                            Time
                          </span>
                          <span className="w-[150px] text-right text-sm font-semibold">
                            Form type
                          </span>
                          <span className="w-[250px] text-right text-sm font-semibold">
                            Value
                          </span>
                          <span className="w-[250px] text-right text-sm font-semibold">
                            Salary debt
                          </span>
                        </div>

                        <div className="flex w-full flex-row items-center justify-start gap-2 bg-gray-100 p-2">
                          <span className="w-[150px] text-sm font-semibold">
                            1
                          </span>
                          <span className="w-[250px] text-sm">
                            {format(new Date(), "dd/MM/yyyy HH:mm")}
                          </span>
                          <span className="w-[150px] text-right text-sm">
                            0
                          </span>
                          <span className="w-[250px] text-right text-sm">
                            0
                          </span>
                          <span className="w-[250px] text-right text-sm">
                            0
                          </span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <MyConfirmDialog
                  open={openConfirmDialog}
                  setOpen={setOpenConfirmDialog}
                  title={contentConfirmDialog.title}
                  content={contentConfirmDialog.content}
                  type={contentConfirmDialog.type}
                  onAccept={() => {
                    setOpenConfirmDialog(false);
                    handleRemoveStaff();
                  }}
                  onCancel={() => setOpenConfirmDialog(false)}
                />
              </div>
            </td>
          </tr>
        </>
      ) : null}
    </React.Fragment>
  );
};
