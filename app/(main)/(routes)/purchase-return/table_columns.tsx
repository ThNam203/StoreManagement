"use client";

import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultSelectColumn,
  defaultIndexColumn,
  defaultColumn,
} from "@/components/ui/my_table_default_column";
import { PurchaseReturn, PurchaseReturnDetail } from "@/entities/PurchaseReturn";
import { useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";

export const purchaseReturnColumnTitles = {
  id: "Order ID",
  subtotal: "Sub-Total",
  discount: "Discount",
  total: "Total",
  note: "Note",
  createdDate: "Created Date",
  staffId: "Creator",
  supplierId: "Supplier",
};

export const purchaseReturnColumns = (): ColumnDef<PurchaseReturn>[] => {
  const columns: ColumnDef<PurchaseReturn>[] = [
    defaultSelectColumn<PurchaseReturn>(),
    defaultIndexColumn<PurchaseReturn>(),
  ];

  for (let key in purchaseReturnColumnTitles) {
    let col: ColumnDef<PurchaseReturn>
    if (key === "staffId") col = creatorIdColumn;
    else if (key === "supplierId") col = supplierIdColumn;
    else col = defaultColumn<PurchaseReturn>(
      key,
      purchaseReturnColumnTitles,
    );
    columns.push(col);
  }

  return columns;
};

export const purchaseReturnDetailColumnTitles = {
  quantity: "Quantity",
  supplyPrice: "Supply Price",
  returnPrice: "Return Price",
};

export const purchaseReturnDetailTableColumns =
  (): ColumnDef<PurchaseReturnDetail>[] => {
    const columns: ColumnDef<PurchaseReturnDetail>[] = [
      defaultSelectColumn<PurchaseReturnDetail>(),
      defaultIndexColumn<PurchaseReturnDetail>(),
      productIdToProductNameColumn,
    ];

    for (let key in purchaseReturnDetailColumnTitles) {
      const col: ColumnDef<PurchaseReturnDetail> =
        defaultColumn<PurchaseReturnDetail>(
          key,
          purchaseReturnDetailColumnTitles,
        );
      columns.push(col);
    }
    columns.push(totalColumn);

    return columns;
  };

const totalColumn: ColumnDef<PurchaseReturnDetail> = {
  accessorKey: "total",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Total" />
  ),
  cell: ({ row }) => {
    const detail = row.original;
    return (
      <p className="text-[0.8rem]">
        {formatPrice(detail.returnPrice * detail.quantity)}
      </p>
    );
  },
};

const productIdToProductNameColumn: ColumnDef<PurchaseReturnDetail> = {
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

const creatorIdColumn: ColumnDef<PurchaseReturn> = {
  accessorKey: "staffId",
  header: ({ column }) => (
    <DataTableColumnHeader
      column={column}
      title={"Creator"}
    />
  ),
  cell: ({ row }) => {
    const value: number = row.getValue("staffId");
    return CreatorIdCell(value)
  },
};

const CreatorIdCell = (staffId: number) => {
  const staffs = useAppSelector((state) => state.staffs.value);
  return <p className="text-[0.8rem]">{staffs.find((v) => v.id === staffId)?.name ?? "Not found"}</p>;
}

const supplierIdColumn: ColumnDef<PurchaseReturn> = {
  accessorKey: "supplierId",
  header: ({ column }) => (
    <DataTableColumnHeader
      column={column}
      title={"Supplier"}
    />
  ),
  cell: ({ row }) => {
    const value: number = row.getValue("supplierId");
    return SupplierIdCell(value)
  },
};

const SupplierIdCell = (supplierId: number) => {
  const suppliers = useAppSelector((state) => state.suppliers.value);
  return <p className="text-[0.8rem]">{suppliers.find((v) => v.id === supplierId)?.name ?? "Not found"}</p>;
}