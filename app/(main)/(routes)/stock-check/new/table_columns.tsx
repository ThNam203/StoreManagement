import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultColumn,
  defaultIndexColumn,
  defaultSelectColumn,
} from "@/components/ui/my_table_default_column";
import { Product } from "@/entities/Product";
import { StockCheckDetail } from "@/entities/StockCheck";
import { cn } from "@/lib/utils";
import { Column, ColumnDef, Getter, Row, Table } from "@tanstack/react-table";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export const stockCheckDetailColumnTitles = {
  productId: "Product ID",
  productName: "Product Name",
  propertiesString: "Properties",
  unitName: "Unit",
  countedStock: "Counted Stock",
  realStock: "Stock",
  diffQuantity: "Diff Quantity",
  diffCost: "Diff Cost",
};

export const stockCheckDetailTableColumns = (
  onQuantityChanged: (productId: number, newQuantity: number) => any,
): ColumnDef<StockCheckDetail>[] => {
  const columns: ColumnDef<StockCheckDetail>[] = [
    defaultSelectColumn<StockCheckDetail>(),
    defaultIndexColumn<StockCheckDetail>(),
  ];

  for (let key in stockCheckDetailColumnTitles) {
    let col: ColumnDef<StockCheckDetail>;
    if (key === "propertiesString")
      col = propertiesStringColumn(key, stockCheckDetailColumnTitles);
    else if (key === "countedStock")
      col = countedColumn(key, stockCheckDetailColumnTitles, onQuantityChanged);
    else
      col = defaultColumn<StockCheckDetail>(key, stockCheckDetailColumnTitles);
    columns.push(col);
  }

  return columns;
};

function propertiesStringColumn(
  accessorKey: string,
  columnHeader: object,
  disableSorting: boolean = false,
): ColumnDef<StockCheckDetail> {
  const col: ColumnDef<StockCheckDetail> = {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={columnHeader[accessorKey as keyof typeof columnHeader]}
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="overflow-hidden">
          <p className="max-w-[150px] animate-marquee text-[0.8rem]">
            {row.original.productProperties}
          </p>
        </div>
      );
    },
  };
  return col;
}

function countedColumn(
  accessorKey: string,
  columnHeader: object,
  onQuantityChanged: (productId: number, newQuantity: number) => any,
  disableSorting: boolean = false,
): ColumnDef<StockCheckDetail> {
  const col: ColumnDef<StockCheckDetail> = {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={columnHeader[accessorKey as keyof typeof columnHeader]}
      />
    ),
    cell: (cellProps) => CountedCell({...cellProps, onQuantityChanged}),
  };
  return col;
}

const CountedCell = ({
  getValue,
  row,
  onQuantityChanged
}: {
  getValue: Getter<number>;
  row: Row<StockCheckDetail>;
  onQuantityChanged: (productId: number, countedStock: number) => any;
}) => {
  const [value, setValue] = useState<number>(getValue());
  const onBlur = () => {
    onQuantityChanged(row.original.productId, value)
  }
  return (
    <div className="flex flex-row items-center gap-[2px]">
      <Minus
        size={16}
        onClick={() => {
          onQuantityChanged(
            row.original.productId,
            row.original.countedStock - 1,
          );
        }}
        className={cn(
          "rounded-full hover:bg-slate-300",
          row.original.countedStock > 1 ? "visible" : "invisible",
        )}
      />
      <input
        min={0}
        type="number"
        className="w-[60px] select-none bg-transparent text-end"
        value={value}
        onChange={(e) => setValue(e.currentTarget.valueAsNumber)}
        onBlur={onBlur}
      ></input>
      <Plus
        size={16}
        onClick={() => {
          onQuantityChanged(
            row.original.productId,
            row.original.countedStock + 1,
          );
        }}
        className="rounded-full hover:bg-slate-300"
      />
    </div>
  );
};

export const stockCheckDetailColumns = () => {};
