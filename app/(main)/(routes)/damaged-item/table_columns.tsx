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
  id: "Document ID",
  note: "Note",
  createdDate: "Created Date",
  creatorId: "Creator",
};

export const damagedItemDocumentColumnVisibilityState = {
  id: true,
  note: false,
  createdDate: true,
  creatorId:true,
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
  columns.push(totalColumn);
  return columns;
};

export const damagedItemDocumentDetailColumnTitles = {
  productId: "Product",
  damagedQuantity: "Quantity",
  costPrice: "Cost Price",
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
    columns.push(detailTotalColumn);

    return columns;
  };

const detailTotalColumn: ColumnDef<DamagedItemDetail> = {
  accessorKey: "total",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Total" />
  ),
  cell: ({ row }) => {
    const detail = row.original;
    return (
      <p className="text-[0.8rem]">
        {detail.costPrice * detail.damagedQuantity}
      </p>
    );
  },
};

const totalColumn: ColumnDef<DamagedItemDocument> = {
  accessorKey: "total",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Total" />
  ),
  cell: ({ row }) => {
    const document = row.original;
    return (
      <p className="text-[0.8rem]">
        {document.products.map((detail) => detail.costPrice * detail.damagedQuantity).reduce((a, b) => a + b, 0)}
      </p>
    );
  },
};
