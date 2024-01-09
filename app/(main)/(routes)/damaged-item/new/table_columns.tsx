import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultColumn,
  defaultIndexColumn,
  defaultSelectColumn,
} from "@/components/ui/my_table_default_column";
import { Product } from "@/entities/Product";
import { cn } from "@/lib/utils";
import scrollbar_style from "@/styles/scrollbar.module.css";
import { formatPrice } from "@/utils";
import { ColumnDef, Getter, Row } from "@tanstack/react-table";
import { Minus, Pencil, Plus } from "lucide-react";
import { useState } from "react";

export type NewDamagedItemDetail = {
  productId: number;
  productName: string;
  unit: string;
  damagedQuantity: number;
  note: string;
  costPrice: number;
};

export const purchaseReturnDetailColumnTitles = {
  productId: "Product Id",
  productName: "Product Name",
  unit: "Unit",
  damagedQuantity: "Quantity",
  costPrice: "Cost price"
};

export const purchaseReturnDetailTableColumns = (
  onQuantityChanged: (productId: number, newQuantity: number) => any,
  onNoteChanged: (productId: number, newNote: string) => any,
  products: Product[],
): ColumnDef<NewDamagedItemDetail>[] => {
  const columns: ColumnDef<NewDamagedItemDetail>[] = [
    defaultSelectColumn<NewDamagedItemDetail>(),
    defaultIndexColumn<NewDamagedItemDetail>(),
  ];

  for (let key in purchaseReturnDetailColumnTitles) {
    let col: ColumnDef<NewDamagedItemDetail>;
    if (key === "damagedQuantity") col = quantityColumn(products, onQuantityChanged);
    else if (key === "productName") col = productNameColumn(onNoteChanged);
    else
      col = defaultColumn<NewDamagedItemDetail>(
        key,
        purchaseReturnDetailColumnTitles,
      );
    columns.push(col);
  }

  columns.push(totalColumn());

  return columns;
};

function totalColumn(
  disableSorting: boolean = false,
): ColumnDef<NewDamagedItemDetail> {
  const col: ColumnDef<NewDamagedItemDetail> = {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total value" />
    ),
    cell: ({ row }) => {
      return (
        <p className="text-[0.8rem] font-bold">
          {formatPrice(row.original.damagedQuantity * row.original.costPrice)}
        </p>
      );
    },
  };
  return col;
}

function productNameColumn(
  onNoteChanged: (productId: number, newNote: string) => any,
  disableSorting: boolean = false,
): ColumnDef<NewDamagedItemDetail> {
  const col: ColumnDef<NewDamagedItemDetail> = {
    accessorKey: "productName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Name" />
    ),
    cell: ({ row }) => ProductNameCell(row.original, onNoteChanged),
  };
  return col;
}

function quantityColumn(
  products: Product[],
  onQuantityChanged: (productId: number, newQuantity: number) => any,
  disableSorting: boolean = false,
): ColumnDef<NewDamagedItemDetail> {
  const col: ColumnDef<NewDamagedItemDetail> = {
    accessorKey: "damagedQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: (cellProps) => QuantityCell({ ...cellProps, onQuantityChanged, maxValue: products.find(p => p.id === cellProps.row.original.productId)?.stock ?? 0}),
  };
  return col;
}

const ProductNameCell = (
  detail: NewDamagedItemDetail,
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
              autoFocus
              defaultValue={detail.note}
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
  maxValue,
  row,
  onQuantityChanged,
}: {
  getValue: Getter<number>;
  maxValue: number;
  row: Row<NewDamagedItemDetail>;
  onQuantityChanged: (productId: number, countedStock: number) => any;
}) => {
  const [value, setValue] = useState<number>(isNaN(getValue()) ? 0 : getValue());
  const onBlur = () => {
    onQuantityChanged(row.original.productId, value);
  };
  return (
    <div className="flex flex-row items-center gap-[2px]">
      <Minus
        size={16}
        onClick={() => {
          const newValue = row.original.damagedQuantity - 1;
          setValue(newValue)
          onQuantityChanged(row.original.productId, newValue);
        }}
        className={cn(
          "rounded-full hover:bg-slate-300",
          value > 1 ? "" : "hidden",
        )}
      />
      <div className="flex flex-col items-center">
      <input
        min={0}
        max={maxValue}
        type="number"
        className="w-[60px] select-none bg-transparent text-end border-b border-gray-400"
        value={value}
        onChange={(e) => setValue(e.currentTarget.valueAsNumber)}
        onBlur={onBlur}
      ></input>
    <p className="text-xs text-gray-400">Max: {maxValue}</p>
      </div>
      {value < maxValue ? <Plus
        size={16}
        onClick={() => {
          const newValue = row.original.damagedQuantity + 1;
          setValue(newValue)
          onQuantityChanged(row.original.productId, newValue);
        }}
        className="rounded-full hover:bg-slate-300"
        /> : null}
    </div>
  );
};