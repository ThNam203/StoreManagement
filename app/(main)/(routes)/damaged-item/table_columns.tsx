"use client";

import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultSelectColumn,
  defaultIndexColumn,
  defaultColumn,
} from "@/components/ui/my_table_default_column";
import { DamagedItemDetail, DamagedItemDocument } from "@/entities/DamagedItemDocument";
import { ColumnDef } from "@tanstack/react-table";

export const damagedItemDocumentColumnTitles = {
  id: "Order ID",
  note: "Note",
  price: "Original Price",
  createdDate: "Created Date",
  creatorId: "Creator",
};

export const damagedItemDocumentColumns = (): ColumnDef<DamagedItemDocument>[] => {
  const columns: ColumnDef<DamagedItemDocument>[] = [
    defaultSelectColumn<DamagedItemDocument>(),
    defaultIndexColumn<DamagedItemDocument>(),
  ];

  for (let key in damagedItemDocumentColumnTitles) {
    const col: ColumnDef<DamagedItemDocument> = defaultColumn<DamagedItemDocument>(
      key,
      damagedItemDocumentColumnTitles,
    );
    columns.push(col);
  }

  return columns;
};

export const damagedItemDocumentDetailColumnTitles = {
  productId: "Product",
  quantity: "Quantity",
  supplyPrice: "Supply Price",
  returnPrice: "Return Price",
};

export const damagedItemDocumentDetailTableColumns =
  (): ColumnDef<DamagedItemDetail>[] => {
    const columns: ColumnDef<DamagedItemDetail>[] = [
      defaultSelectColumn<DamagedItemDetail>(),
      defaultIndexColumn<DamagedItemDetail>(),
    ];

    for (let key in damagedItemDocumentDetailColumnTitles) {
      const col: ColumnDef<DamagedItemDetail> =
        defaultColumn<DamagedItemDetail>(
          key,
          damagedItemDocumentDetailColumnTitles,
        );
      columns.push(col);
    }
    columns.push(totalColumn);

    return columns;
  };

const totalColumn: ColumnDef<DamagedItemDetail> = {
  accessorKey: "total",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Total" />
  ),
  cell: ({ row }) => {
    const detail = row.original;
    return (
      <p className="text-[0.8rem]">
        {detail.price * detail.quantity}
      </p>
    );
  },
};
