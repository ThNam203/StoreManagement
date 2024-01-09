"use client";

import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultColumn,
  defaultSelectColumn,
  defaultIndexColumn,
} from "@/components/ui/my_table_default_column";
import { Invoice } from "@/entities/Invoice";
import {Product} from "@/entities/Product";
import { ReturnInvoiceServer } from "@/entities/ReturnInvoice";
import { useAppSelector } from "@/hooks";
import { ColumnDef } from "@tanstack/react-table";

export const returnDefaultVisibilityState = {
  id: true,
  invoiceId: true,
  createdAt: false,
  staffId: false,
  discountValue: true,
  returnFee: true,
  total: true,
  note: true,
  paymentMethod: false
  // TODO: MISSING CUSTOMER
}

export const returnColumnTitles = {
  id: "Return ID",
  invoiceId: "Invoice ID",
  createdAt: "Created At",
  staffId: "Staff ID",
  discountValue: "Discount",
  returnFee: "Return Fee",
  total: "Total",
  note: "Note",
  paymentMethod: "Payment Method"
};

export const returnTableColumns = (): ColumnDef<ReturnInvoiceServer>[] => {
  const columns: ColumnDef<ReturnInvoiceServer>[] = [
    defaultSelectColumn<ReturnInvoiceServer>(),
    defaultIndexColumn<ReturnInvoiceServer>(),
  ];

  for (let key in returnColumnTitles) {
    let col: ColumnDef<ReturnInvoiceServer>;
    if (key === "staffId") col = staffIdColumn;
    else col = defaultColumn<ReturnInvoiceServer>(key, returnColumnTitles);
    columns.push(col);
  }

  return columns;
};

const staffIdColumn: ColumnDef<ReturnInvoiceServer> = {
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