"use client";

import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultSelectColumn,
  defaultIndexColumn,
  defaultColumn,
} from "@/components/ui/my_table_default_column";
import { StockCheck, StockCheckDetail } from "@/entities/StockCheck";
import { useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const stockCheckColumnTitles = {
  id: "ID",
  totalCountedStock: "Counted Stock",
  totalStock: "Stock",
  stockDifference: "Total Stock Diff",
  totalValueDifference: "Total Value Diff",
  totalValue: "Total Value",
  note: "Note",
  creatorId: "Creator",
  createdDate: "Created Date",
};

export const stockCheckTableColumns = (): ColumnDef<StockCheck>[] => {
  const columns: ColumnDef<StockCheck>[] = [
    defaultSelectColumn<StockCheck>(),
    defaultIndexColumn<StockCheck>(),
  ];

  for (let key in stockCheckColumnTitles) {
    const col: ColumnDef<StockCheck> = defaultColumn<StockCheck>(
      key,
      stockCheckColumnTitles,
    );
    columns.push(col);
  }

  return columns;
};

export const stockCheckDetailColumnTitles = {
  countedStock: "Counted Stock",
  realStock: "Stock",
  stockDifference: "Stock Difference",
  valueDifference: "Value Difference",
};

export const stockCheckDetailTableColumns =
  (): ColumnDef<StockCheckDetail>[] => {
    const columns: ColumnDef<StockCheckDetail>[] = [
      defaultIndexColumn<StockCheckDetail>(),
      productIdToProductNameColumn,
    ];

    for (let key in stockCheckDetailColumnTitles) {
      const col: ColumnDef<StockCheckDetail> = defaultColumn<StockCheckDetail>(
        key,
        stockCheckDetailColumnTitles,
      );
      columns.push(col);
    }

    return columns;
  };

const productIdToProductNameColumn: ColumnDef<StockCheckDetail> = {
  accessorKey: "productId",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Product" />
  ),
  cell: ({ row }) => {
    const detail = row.original;
    return ProductNameCell(detail.productId);
  },
};

const ProductNameCell = (productId: number) => {
  const products = useAppSelector((state) => state.products.value);
  const product = products.find((v) => v.id === productId)!;
  return (
    <p className={cn("text-[0.8rem]", product.isDeleted ? "text-red-500" : "")}>
      {product.name}
    </p>
  );
};
