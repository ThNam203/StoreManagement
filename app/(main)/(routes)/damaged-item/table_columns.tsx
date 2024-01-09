"use client";

import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultSelectColumn,
  defaultIndexColumn,
  defaultColumn,
} from "@/components/ui/my_table_default_column";
import { DamagedItemDetail, DamagedItemDocument } from "@/entities/DamagedItemDocument";
import { useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const damagedItemDocumentColumnTitles = {
  id: "Document ID",
  note: "Note",
  createdDate: "Created Date",
  creatorId: "Creator",
};

export const damagedItemDocumentColumnVisibilityState = {
  id: true,
  createdDate: true,
  creatorId:true,
  note: true,
};

export const damagedItemDocumentColumns = (): ColumnDef<DamagedItemDocument>[] => {
  const columns: ColumnDef<DamagedItemDocument>[] = [
    defaultSelectColumn<DamagedItemDocument>(),
    defaultIndexColumn<DamagedItemDocument>(),
  ];

  for (let key in damagedItemDocumentColumnTitles) {
    let col: ColumnDef<DamagedItemDocument>
    if (key === "creatorId") col = creatorIdColumn;
    else col = defaultColumn<DamagedItemDocument>(
      key,
      damagedItemDocumentColumnTitles,
    );
    columns.push(col);
  }
  columns.push(totalColumn);
  return columns;
};

export const damagedItemDocumentDetailColumnTitles = {
  damagedQuantity: "Quantity",
  costPrice: "Cost Price",
};

export const damagedItemDocumentDetailTableColumns =
  (): ColumnDef<DamagedItemDetail>[] => {
    const columns: ColumnDef<DamagedItemDetail>[] = [
      // defaultSelectColumn<DamagedItemDetail>(),
      defaultIndexColumn<DamagedItemDetail>(),
      productIdToProductNameColumn,
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

const productIdToProductNameColumn: ColumnDef<DamagedItemDetail> = {
  accessorKey: "productId",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Product" />
  ),
  cell: ({ row }) => {
    const detail = row.original;
    return ProductNameCell(detail.productId)
  },
};

const ProductNameCell = (productId: number) => {
  const products = useAppSelector((state) => state.products.value);
  const product = products.find((v) => v.id === productId)!
  return <p className={cn("text-[0.8rem]", product.isDeleted ? "text-red-500" : "")}>{product.name}</p>;
}

const creatorIdColumn: ColumnDef<DamagedItemDocument> = {
  accessorKey: "creatorId",
  header: ({ column }) => (
    <DataTableColumnHeader
      column={column}
      title={"Creator"}
    />
  ),
  cell: ({ row }) => {
    const value: number = row.getValue("creatorId");
    return CreatorIdCell(value)
  },
};

const CreatorIdCell = (staffId: number) => {
  const staffs = useAppSelector((state) => state.staffs.value);
  return <p className="text-[0.8rem]">{staffs.find((v) => v.id === staffId)?.name ?? "Not found"}</p>;
}