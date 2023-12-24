"use client";

import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultSelectColumn,
  defaultIndexColumn,
  defaultColumn,
} from "@/components/ui/my_table_default_column";
import { PurchaseReturn, PurchaseReturnDetail } from "@/entities/PurchaseReturn";
import { ColumnDef } from "@tanstack/react-table";

export const purchaseReturnColumnTitles = {
  id: "Order ID",
  subtotal: "Sub-Total",
  discount: "Discount",
  total: "Total",
  note: "Note",
  createdDate: "Created Date",
  staffId: "Creator",
  supplierId: "Supplier",
};

export const purchaseReturnColumns = (): ColumnDef<PurchaseReturn>[] => {
  const columns: ColumnDef<PurchaseReturn>[] = [
    defaultSelectColumn<PurchaseReturn>(),
    defaultIndexColumn<PurchaseReturn>(),
  ];

  for (let key in purchaseReturnColumnTitles) {
    const col: ColumnDef<PurchaseReturn> = defaultColumn<PurchaseReturn>(
      key,
      purchaseReturnColumnTitles,
    );
    columns.push(col);
  }

  return columns;
};

export const purchaseReturnDetailColumnTitles = {
  productId: "Product",
  quantity: "Quantity",
  supplyPrice: "Supply Price",
  returnPrice: "Return Price",
};

export const purchaseReturnDetailTableColumns =
  (): ColumnDef<PurchaseReturnDetail>[] => {
    const columns: ColumnDef<PurchaseReturnDetail>[] = [
      defaultSelectColumn<PurchaseReturnDetail>(),
      defaultIndexColumn<PurchaseReturnDetail>(),
    ];

    for (let key in purchaseReturnDetailColumnTitles) {
      const col: ColumnDef<PurchaseReturnDetail> =
        defaultColumn<PurchaseReturnDetail>(
          key,
          purchaseReturnDetailColumnTitles,
        );
      columns.push(col);
    }
    columns.push(totalColumn);

    return columns;
  };

const totalColumn: ColumnDef<PurchaseReturnDetail> = {
  accessorKey: "total",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Total" />
  ),
  cell: ({ row }) => {
    const detail = row.original;
    return (
      <p className="text-[0.8rem]">
        {detail.returnPrice * detail.quantity}
      </p>
    );
  },
};
