import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultColumn,
  defaultIndexColumn,
  defaultSelectColumn,
} from "@/components/ui/my_table_default_column";
import { Product } from "@/entities/Product";
import { cn } from "@/lib/utils";
import { Column, ColumnDef, Getter, Row, Table } from "@tanstack/react-table";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export type NewPurchaseOrderDetail = {
  productId: number;
  productName: string;
  unit: string;
  quantity: number;
  price: number;
  discount: number;
};

export const purchaseOrderDetailColumnTitles = {
  productId: "Product Id",
  productName: "Product Name",
  unit: "Unit",
  quantity: "Quantity",
  price: "Unit Price",
  discount: "Discount",
};

export const purchaseOrderDetailTableColumns = (
  onQuantityChanged: (productId: number, newQuantity: number) => any,
): ColumnDef<NewPurchaseOrderDetail>[] => {
  const columns: ColumnDef<NewPurchaseOrderDetail>[] = [
    defaultSelectColumn<NewPurchaseOrderDetail>(),
    defaultIndexColumn<NewPurchaseOrderDetail>(),
  ];

  for (let key in purchaseOrderDetailColumnTitles) {
    let col: ColumnDef<NewPurchaseOrderDetail>;
    if (key === "quantity") col = quantityColumn(onQuantityChanged);
    else
      col = defaultColumn<NewPurchaseOrderDetail>(
        key,
        purchaseOrderDetailColumnTitles,
      );
    columns.push(col);
  }

  return columns;
};

function quantityColumn(
  onQuantityChanged: (productId: number, newQuantity: number) => any,
  disableSorting: boolean = false,
): ColumnDef<NewPurchaseOrderDetail> {
  const col: ColumnDef<NewPurchaseOrderDetail> = {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: (cellProps) => QuantityCell({ ...cellProps, onQuantityChanged }),
  };
  return col;
}

const QuantityCell = ({
  getValue,
  row,
  onQuantityChanged,
}: {
  getValue: Getter<number>;
  row: Row<NewPurchaseOrderDetail>;
  onQuantityChanged: (productId: number, countedStock: number) => any;
}) => {
  const [value, setValue] = useState<number>(getValue());
  const onBlur = () => {
    onQuantityChanged(row.original.productId, value);
  };
  return (
    <div className="flex flex-row items-center gap-[2px]">
      <Minus
        size={16}
        onClick={() => {
          onQuantityChanged(row.original.productId, row.original.quantity - 1);
        }}
        className={cn(
          "rounded-full hover:bg-slate-300",
          row.original.quantity > 1 ? "visible" : "invisible",
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
          onQuantityChanged(row.original.productId, row.original.quantity + 1);
        }}
        className="rounded-full hover:bg-slate-300"
      />
    </div>
  );
};

export const stockCheckDetailColumns = () => {};
