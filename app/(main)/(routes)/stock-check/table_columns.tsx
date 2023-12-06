"use client";

import {
  defaultSelectColumn,
  defaultIndexColumn,
  defaultColumn,
} from "@/components/ui/my_table_default_column";
import { StockCheck, StockCheckDetail } from "@/entities/StockCheck";
import { ColumnDef } from "@tanstack/react-table";

export const stockCheckColumnTitles = {
  id: "ID",
  totalCountedStock: "Counted Stock",
  totalStock: "Stock",
  stockDifference: "Stock Difference",
  totalValueDifference: "Value Difference",
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
      stockCheckColumnTitles
    );
    columns.push(col);
  }

  return columns;
};

export const stockCheckDetailColumnTitles = {
  productId: "Product ID",
  countedStock: "Counted Stock",
  realStock: "Stock",
  stockDifference: "Stock Difference",
  valueDifference: "Value Difference",
};

export const stockCheckDetailTableColumns =
  (): ColumnDef<StockCheckDetail>[] => {
    const columns: ColumnDef<StockCheckDetail>[] = [
      defaultSelectColumn<StockCheckDetail>(),
      defaultIndexColumn<StockCheckDetail>(),
    ];

    for (let key in stockCheckDetailColumnTitles) {
      const col: ColumnDef<StockCheckDetail> = defaultColumn<StockCheckDetail>(
        key,
        stockCheckDetailColumnTitles
      );
      columns.push(col);
    }

    return columns;
  };
