"use client";

import { Input } from "@/components/ui/input";
import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultSelectColumn,
  defaultIndexColumn,
  defaultColumn,
} from "@/components/ui/my_table_default_column";
import Product from "@/entities/Product";
import { CellContext, ColumnDef } from "@tanstack/react-table";

export type DamagedItem = {
  id: number,
  value: string,
  createdDate: Date,
  branch: string,
  creator: string,
  note: string,
  status: string,
}

export const columnTitles = {
  id: 'ID',
  value: 'Total Value',
  createdDate: 'Created Date',
  branch: 'Branch',
  creator: 'Creator',
  note: 'Note',
  status: 'Status',
};

export const tableColumns = (): ColumnDef<DamagedItem>[] => {
  const columns: ColumnDef<DamagedItem>[] = [
    defaultSelectColumn<DamagedItem>(),
    defaultIndexColumn<DamagedItem>(),
  ];

  for (let key in columnTitles) {
    const col: ColumnDef<DamagedItem> = defaultColumn<DamagedItem>(key, columnTitles);
    columns.push(col);
  }

  return columns;
};
