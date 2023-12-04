"use client";

import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultColumn,
  defaultIndexColumn,
  defaultSelectColumn,
  getColumns,
} from "@/components/ui/my_table_default_column";
import { Staff } from "@/entities/Staff";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const columnHeader = {
  avatar: "Avatar",
  id: "Staff ID",
  name: "Staff Name",
  phoneNumber: "Phone Number",
  CCCD: "CCCD",
  salaryDebt: "Salary Debt",
  note: "Note",
  birthday: "Birthday",
  sex: "Sex",
  email: "Email",
  address: "Address",
  position: "Position",
  createAt: "Date Created",
};

export const getStaffColumns = (): ColumnDef<Staff>[] => {
  const columns: ColumnDef<Staff>[] = [
    defaultSelectColumn<Staff>(),
    defaultIndexColumn<Staff>(),
  ];

  for (let key in columnHeader) {
    let col: ColumnDef<Staff>;
    if (key === "avatar") col = imageColumn(key, columnHeader[key]);
    else col = defaultColumn<Staff>(key, columnHeader);
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
          className="object-contain mx-auto"
        />
      );
    },
    enableSorting: false,
  };
  return col;
}
