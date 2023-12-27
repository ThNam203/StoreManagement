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

export const userColumnTitles = {
  avatar: "Avatar",
  id: "User ID",
  name: "User Name",
  phoneNumber: "Phone Number",
  cccd: "CCCD",
  note: "Note",
  birthday: "Birthday",
  sex: "Sex",
  email: "Email",
  address: "Address",
  position: "Position",
  createAt: "Date Created",
};

export const userDefaultVisibilityState = {
  avatar: true,
  id: true,
  name: true,
  phoneNumber: true,
  cccd: false,
  note: false,
  birthday: false,
  sex: false,
  email: true,
  address: false,
  position: true,
  createAt: false,
};

export const userTableColumns = (): ColumnDef<Staff>[] => {
  const columns: ColumnDef<Staff>[] = [
    defaultSelectColumn<Staff>(),
    defaultIndexColumn<Staff>(),
  ];

  for (let key in userColumnTitles) {
    let col: ColumnDef<Staff>;
    if (key === "avatar") col = imageColumn(key, userColumnTitles[key]);
    else if (key === "birthday")
      col = birthdayColumn(key, userColumnTitles[key]);
    else col = defaultColumn<Staff>(key, userColumnTitles);
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
