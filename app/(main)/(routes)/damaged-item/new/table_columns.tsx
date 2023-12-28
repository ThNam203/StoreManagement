import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultColumn,
  defaultIndexColumn,
  defaultSelectColumn,
} from "@/components/ui/my_table_default_column";
import { cn } from "@/lib/utils";
import scrollbar_style from "@/styles/scrollbar.module.css";
import { ColumnDef, Getter, Row } from "@tanstack/react-table";
import { Minus, Pencil, Plus } from "lucide-react";
import { useState } from "react";

export type NewDamagedItemDetail = {
  productId: number;
  productName: string;
  unit: string;
  quantity: number;
  note: string;
  price: number;
};

export const purchaseReturnDetailColumnTitles = {
  productId: "Product Id",
  productName: "Product Name",
  unit: "Unit",
  quantity: "Quantity",
  price: "Original price"
};

export const purchaseReturnDetailTableColumns = (
  onQuantityChanged: (productId: number, newQuantity: number) => any,
  onNoteChanged: (productId: number, newNote: string) => any,
  onReturnPriceChanged: (productId: number, newPrice: number) => any,
): ColumnDef<NewDamagedItemDetail>[] => {
  const columns: ColumnDef<NewDamagedItemDetail>[] = [
    defaultSelectColumn<NewDamagedItemDetail>(),
    defaultIndexColumn<NewDamagedItemDetail>(),
  ];

  for (let key in purchaseReturnDetailColumnTitles) {
    let col: ColumnDef<NewDamagedItemDetail>;
    if (key === "quantity") col = quantityColumn(onQuantityChanged);
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
          {row.original.quantity * row.original.price}
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
  onQuantityChanged: (productId: number, newQuantity: number) => any,
  disableSorting: boolean = false,
): ColumnDef<NewDamagedItemDetail> {
  const col: ColumnDef<NewDamagedItemDetail> = {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: (cellProps) => QuantityCell({ ...cellProps, onQuantityChanged }),
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
              className={cn("resize-none", scrollbar_style.scrollbar)}
              placeholder="note..."
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
  row: Row<NewDamagedItemDetail>;
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