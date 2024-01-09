"use client";

import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultColumn,
  defaultSelectColumn,
  defaultIndexColumn,
} from "@/components/ui/my_table_default_column";
import { Invoice } from "@/entities/Invoice";
import {Product} from "@/entities/Product";
import { useAppSelector } from "@/hooks";
import { ColumnDef } from "@tanstack/react-table";

export const invoiceDefaultVisibilityState = {
    id: true,
    cash: false,
    changed: false,
    subTotal: false,
    discountValue: true,
    total: true,
    paymentMethod: false,
    discountCode: false,
    customerId: true,
    staffId: true,
    createdAt: true,
}

export const invoiceColumnTitles = {
  id: "Invoice ID",
  cash: "Paid",
  changed: "Change",
  subTotal: "Sub-Total",
  discountValue: "Discount Value",
  total: "Total",
  paymentMethod: "Payment Method",
  discountCode: "Discount Code",
  customerId: "Customer",
  staffId: "Staff",
  createdAt: "Created At",
};

export const invoiceTableColumns = (): ColumnDef<Invoice>[] => {
  const columns: ColumnDef<Invoice>[] = [
    defaultSelectColumn<Invoice>(),
    defaultIndexColumn<Invoice>(),
  ];

  for (let key in invoiceColumnTitles) {
    let col: ColumnDef<Invoice>;
    if (key === "staffId") {
      col = staffIdColumn;
    } else if (key === "customerId") {
      col = customerIdColumn;
    }
    else col = defaultColumn<Invoice>(key, invoiceColumnTitles);
    columns.push(col);
  }

  return columns;
};

const staffIdColumn: ColumnDef<Invoice> = {
  accessorKey: "staffId",
  header: ({ column }) => (
    <DataTableColumnHeader
      column={column}
      title={"Staff"}
    />
  ),
  cell: ({ row }) => {
    const value: number = row.getValue("staffId");
    return StaffIdCell(value)
  },
};

const StaffIdCell = (staffId: number) => {
  const staffs = useAppSelector((state) => state.staffs.value);
  return <p className="text-[0.8rem]">{staffs.find((v) => v.id === staffId)?.name ?? "Not found"}</p>;
}

const customerIdColumn: ColumnDef<Invoice> = {
  accessorKey: "customerId",
  header: ({ column }) => (
    <DataTableColumnHeader
      column={column}
      title={"Customer"}
    />
  ),
  cell: ({ row }) => {
    const value: number = row.getValue("customerId");
    return CustomerIdCell(value)
  },
};

const CustomerIdCell = (customerId: number) => {
  const customers = useAppSelector((state) => state.customers.value);
  return <p className="text-[0.8rem]">{customers.find((v) => v.id === customerId)?.name ?? ""}</p>;
}