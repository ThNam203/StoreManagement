"use client";

import {
  defaultColumn,
  defaultIndexColumn,
  defaultSelectColumn,
} from "@/components/ui/my_table_default_column";
import { Paycheck } from "@/entities/Staff";
import { ColumnDef } from "@tanstack/react-table";

export const paycheckDefaultVisibilityState = {
  workingPeriod: true,
  totalSalary: true,
  paid: true,
  needToPay: true,
};

export const paycheckColumnTitles = {
  workingPeriod: "Working Period",
  totalSalary: "Total Salary",
  paid: "Paid",
  needToPay: "Need To Pay",
};

export const paycheckTableColumns = (): ColumnDef<Paycheck>[] => {
  const columns: ColumnDef<Paycheck>[] = [];

  for (let key in paycheckColumnTitles) {
    columns.push(defaultColumn<Paycheck>(key, paycheckColumnTitles));
  }

  return columns;
};
