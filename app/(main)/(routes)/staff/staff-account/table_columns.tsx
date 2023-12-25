"use client";

import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultColumn,
  defaultIndexColumn,
  defaultSelectColumn,
} from "@/components/ui/my_table_default_column";
import {
  BonusAndPunish,
  DetailPunishAndBonus,
  ViolationAndReward,
} from "@/entities/Attendance";
import {
  Paycheck,
  SimpleTransaction,
  Staff,
  WorkSchedule,
} from "@/entities/Staff";
import { DetailSalaryDebt } from "@/entities/Transaction";
import { formatDate } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ReactNode } from "react";

export const paycheckDefaultVisibilityState = {
  workingPeriod: true,
  totalSalary: true,
  paid: true,
  needToPay: true,
};

export const paycheckColumnTitles = {
  workingPeriod: "Working Period",
  totalSalary: "Total Salary",
  paid: "Paid",
  needToPay: "Need To Pay",
};

export const paycheckTableColumns = (): ColumnDef<Paycheck>[] => {
  const columns: ColumnDef<Paycheck>[] = [];

  for (let key in paycheckColumnTitles) {
    columns.push(defaultColumn<Paycheck>(key, paycheckColumnTitles));
  }

  return columns;
};

export const salaryDebtDefaultVisibilityState = {
  id: true,
  time: true,
  description: true,
  value: true,
  salaryDebt: true,
};

export const salaryDebtColumnTitles = {
  id: "Form ID",
  time: "Time",
  description: "Description",
  value: "Value",
  salaryDebt: "Salary debt",
};

export const salaryDebtTableColumns = (): ColumnDef<SimpleTransaction>[] => {
  const columns: ColumnDef<SimpleTransaction>[] = [];

  for (let key in salaryDebtColumnTitles) {
    columns.push(defaultColumn<SimpleTransaction>(key, salaryDebtColumnTitles));
  }

  return columns;
};

export const workScheduleDefaultVisibilityState = {
  date: true,
  shiftName: true,
  startTime: true,
  endTime: true,
  note: true,
};

export const workScheduleColumnTitles = {
  date: "Date",
  shiftName: "Shift name",
  startTime: "Start time",
  endTime: "End time",
  note: "Note",
};

export const workScheduleTableColumns = (): ColumnDef<WorkSchedule>[] => {
  const columns: ColumnDef<WorkSchedule>[] = [];

  for (let key in workScheduleColumnTitles) {
    if (key === "startTime" || key === "endTime")
      columns.push(timeColumn(key, workScheduleColumnTitles[key]));
    else
      columns.push(defaultColumn<WorkSchedule>(key, workScheduleColumnTitles));
  }

  return columns;
};

function timeColumn(
  accessorKey: string,
  title: string,
): ColumnDef<WorkSchedule> {
  const col: ColumnDef<WorkSchedule> = {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const value: ReactNode = row.getValue(accessorKey);
      const formatedValue: ReactNode =
        value instanceof Date ? formatDate(value, "time") : value;

      return <p className="text-[0.8rem]">{formatedValue}</p>;
    },
  };
  return col;
}

export const punishDefaultVisibilityState = {
  name: true,
  value: true,
  times: true,
};

export const punishColumnTitles = {
  name: "Name",
  value: "Value",
  times: "Times",
};

export const punishTableColumns = (): ColumnDef<BonusAndPunish>[] => {
  const columns: ColumnDef<BonusAndPunish>[] = [];

  for (let key in punishColumnTitles) {
    columns.push(defaultColumn<BonusAndPunish>(key, punishColumnTitles));
  }

  return columns;
};

export const staffColumnTitles = {
  avatar: "Avatar",
  id: "Staff ID",
  name: "Staff Name",
  phoneNumber: "Phone Number",
  cccd: "CCCD",
  salaryDebt: "Salary Debt",
  note: "Note",
  birthday: "Birthday",
  sex: "Sex",
  email: "Email",
  address: "Address",
  position: "Position",
  createAt: "Date Created",
};

export const staffDefaultVisibilityState = {
  avatar: true,
  id: true,
  name: true,
  phoneNumber: true,
  cccd: false,
  salaryDebt: true,
  note: false,
  birthday: false,
  sex: false,
  email: true,
  address: false,
  position: true,
  createAt: false,
};

export const staffTableColumns = (): ColumnDef<Staff>[] => {
  const columns: ColumnDef<Staff>[] = [
    defaultSelectColumn<Staff>(),
    defaultIndexColumn<Staff>(),
  ];

  for (let key in staffColumnTitles) {
    let col: ColumnDef<Staff>;
    if (key === "avatar") col = imageColumn(key, staffColumnTitles[key]);
    else if (key === "birthday")
      col = birthdayColumn(key, staffColumnTitles[key]);
    else col = defaultColumn<Staff>(key, staffColumnTitles);
    columns.push(col);
  }

  return columns;
};

function imageColumn(accessorKey: string, title: string): ColumnDef<Staff> {
  const col: ColumnDef<Staff> = {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const value: string = row.getValue(accessorKey);
      return (
        <Image
          alt="staff avatar"
          width={30}
          height={30}
          src={value || "/default-user-avatar.png"}
          className="mx-auto object-contain"
        />
      );
    },
    enableSorting: false,
  };
  return col;
}
function birthdayColumn(accessorKey: string, title: string): ColumnDef<Staff> {
  const col: ColumnDef<Staff> = {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const value: ReactNode = row.getValue(accessorKey);
      const formatedValue: ReactNode =
        value instanceof Date ? formatDate(value, "date") : value;

      return <p className="text-[0.8rem]">{formatedValue}</p>;
    },
    enableSorting: false,
  };
  return col;
}

export const detailSalaryDebtDefaultVisibilityState = {
  id: true,
  totalSalary: true,
  paid: true,
  needToPay: true,
  value: true,
};

export const detailSalaryDebtColumnTitles = {
  id: "Form ID",
  totalSalary: "Total Salary",
  paid: "Paid",
  needToPay: "Need To Pay",
  value: "Pay for staff",
};

export const detailSalaryDebtTableColumns =
  (): ColumnDef<DetailSalaryDebt>[] => {
    const columns: ColumnDef<DetailSalaryDebt>[] = [];

    for (let key in detailSalaryDebtColumnTitles) {
      columns.push(
        defaultColumn<DetailSalaryDebt>(key, detailSalaryDebtColumnTitles),
      );
    }

    return columns;
  };

export const detailPunishAndBonusDefaultVisibilityState = {
  name: true,
  multiply: true,
  value: true,
};

export const detailPunishAndBonusColumnTitles = {
  name: "Name",
  multiply: "Times",
  value: "Value",
};

export const detailPunishAndBonusTableColumns =
  (): ColumnDef<DetailPunishAndBonus>[] => {
    const columns: ColumnDef<DetailPunishAndBonus>[] = [];

    for (let key in detailPunishAndBonusColumnTitles) {
      columns.push(
        defaultColumn<DetailPunishAndBonus>(
          key,
          detailPunishAndBonusColumnTitles,
        ),
      );
    }

    return columns;
  };
