import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultColumn,
  defaultIndexColumn,
  defaultSelectColumn,
} from "@/components/ui/my_table_default_column";
import scrollbar_style from "@/styles/scrollbar.module.css";
import { Product } from "@/entities/Product";
import { cn } from "@/lib/utils";
import { Column, ColumnDef, Getter, Row, Table } from "@tanstack/react-table";
import { Minus, Pencil, Plus } from "lucide-react";
import { useState } from "react";

export type NewPurchaseOrderDetail = {
  productId: number;
  productName: string;
  unit: string;
  quantity: number;
  note: string;
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
  onNoteChanged: (productId: number, newNote: string) => any,
): ColumnDef<NewPurchaseOrderDetail>[] => {
  const columns: ColumnDef<NewPurchaseOrderDetail>[] = [
    defaultSelectColumn<NewPurchaseOrderDetail>(),
    defaultIndexColumn<NewPurchaseOrderDetail>(),
  ];

  for (let key in purchaseOrderDetailColumnTitles) {
    let col: ColumnDef<NewPurchaseOrderDetail>;
    if (key === "quantity") col = quantityColumn(onQuantityChanged);
    else if (key === "productName") col = productNameColumn(onNoteChanged);
    else
      col = defaultColumn<NewPurchaseOrderDetail>(
        key,
        purchaseOrderDetailColumnTitles,
      );
    columns.push(col);
  }

  columns.push(totalColumn());

  return columns;
};

function totalColumn(
  disableSorting: boolean = false,
): ColumnDef<NewPurchaseOrderDetail> {
  const col: ColumnDef<NewPurchaseOrderDetail> = {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      return (
        <p className="text-[0.8rem] font-bold">
          {row.original.quantity * row.original.price - row.original.discount}
        </p>
      );
    },
  };
  return col;
}

function productNameColumn(
  onNoteChanged: (productId: number, newNote: string) => any,
  disableSorting: boolean = false,
): ColumnDef<NewPurchaseOrderDetail> {
  const col: ColumnDef<NewPurchaseOrderDetail> = {
    accessorKey: "productName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Name" />
    ),
    cell: ({ row }) => ProductNameCell(row.original, onNoteChanged),
  };
  return col;
}

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

const ProductNameCell = (
  detail: NewPurchaseOrderDetail,
  onNoteChanged: (productId: number, newNote: string) => any,
) => {
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  return (
    <div className="flex flex-col">
      <p className="text-[0.8rem]">{detail.productName}</p>
      <div className="relative">
        {showNoteEditor ? <textarea
              className={cn("resize-none text-xs", scrollbar_style.scrollbar)}
              placeholder="note..."
              defaultValue={detail.note}
              autoFocus
              onBlur={(e) => {
                onNoteChanged(detail.productId, e.currentTarget.value)
                setShowNoteEditor(false)
              }}
            /> : <div className="flex items-center" onClick={() => setShowNoteEditor(true)}>
          <p className="text-xs text-gray-500 max-w-[150px] overflow-hidden">
            {detail.note.length > 0 ? detail.note : "note..."}
          </p>
          <Pencil size={10} className="ml-1"/>
        </div>}
      </div>
    </div>
  );
};

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
          row.original.quantity > 1 ? "" : "hidden",
        )}
      />
      <input
        min={0}
        type="number"
        className="w-[60px] select-none bg-transparent text-end border-b border-gray-400"
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
