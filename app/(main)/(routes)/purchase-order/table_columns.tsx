"use client";

import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultSelectColumn,
  defaultIndexColumn,
  defaultColumn,
} from "@/components/ui/my_table_default_column";
import { PurchaseOrder, PurchaseOrderDetail } from "@/entities/PurchaseOrder";
import { ColumnDef } from "@tanstack/react-table";

export const purchaseOrderColumnTitles = {
  id: "Order ID",
  subtotal: "Sub-Total",
  discount: "Discount",
  total: "Total",
  note: "Note",
  createdDate: "Created Date",
  staffId: "Creator",
  supplierId: "Supplier",
};

export const purchaseOrderColumns = (): ColumnDef<PurchaseOrder>[] => {
  const columns: ColumnDef<PurchaseOrder>[] = [
    defaultSelectColumn<PurchaseOrder>(),
    defaultIndexColumn<PurchaseOrder>(),
  ];

  for (let key in purchaseOrderColumnTitles) {
    const col: ColumnDef<PurchaseOrder> = defaultColumn<PurchaseOrder>(
      key,
      purchaseOrderColumnTitles,
    );
    columns.push(col);
  }

  return columns;
};

export const purchaseOrderDetailColumnTitles = {
  productId: "Product",
  quantity: "Quantity",
  price: "Price",
  discount: "Discount",
};

export const purchaseOrderDetailTableColumns =
  (): ColumnDef<PurchaseOrderDetail>[] => {
    const columns: ColumnDef<PurchaseOrderDetail>[] = [
      defaultSelectColumn<PurchaseOrderDetail>(),
      defaultIndexColumn<PurchaseOrderDetail>(),
    ];

    for (let key in purchaseOrderDetailColumnTitles) {
      const col: ColumnDef<PurchaseOrderDetail> =
        defaultColumn<PurchaseOrderDetail>(
          key,
          purchaseOrderDetailColumnTitles,
        );
      columns.push(col);
    }
    columns.push(totalColumn);

    return columns;
  };

const totalColumn: ColumnDef<PurchaseOrderDetail> = {
  accessorKey: "total",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Total" />
  ),
  cell: ({ row }) => {
    const detail = row.original;
    return (
      <p className="text-[0.8rem]">
        {detail.price * detail.quantity - detail.discount}
      </p>
    );
  },
};
