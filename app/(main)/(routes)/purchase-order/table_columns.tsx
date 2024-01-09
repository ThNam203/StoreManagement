"use client";

import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultSelectColumn,
  defaultIndexColumn,
  defaultColumn,
} from "@/components/ui/my_table_default_column";
import { PurchaseOrder, PurchaseOrderDetail } from "@/entities/PurchaseOrder";
import { useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const purchaseOrderColumnTitles = {
  id: "Order ID",
  subtotal: "Sub-Total",
  discount: "Discount",
  total: "Total",
  note: "Note",
  createdDate: "Created Date",
  staffId: "Creator",
  supplierId: "Supplier",
};

export const purchaseOrderColumns = (): ColumnDef<PurchaseOrder>[] => {
  const columns: ColumnDef<PurchaseOrder>[] = [
    defaultSelectColumn<PurchaseOrder>(),
    defaultIndexColumn<PurchaseOrder>(),
  ];

  for (let key in purchaseOrderColumnTitles) {
    let col: ColumnDef<PurchaseOrder>
    if (key === "staffId") col = creatorIdColumn;
    else if (key === "supplierId") col = supplierIdColumn;
    else col = defaultColumn<PurchaseOrder>(
      key,
      purchaseOrderColumnTitles,
    );
    columns.push(col);
  }

  return columns;
};

export const purchaseOrderDetailColumnTitles = {
  quantity: "Quantity",
  price: "Price",
  discount: "Discount",
};

export const purchaseOrderDetailTableColumns =
  (): ColumnDef<PurchaseOrderDetail>[] => {
    const columns: ColumnDef<PurchaseOrderDetail>[] = [
      defaultSelectColumn<PurchaseOrderDetail>(),
      defaultIndexColumn<PurchaseOrderDetail>(),
    ];

    columns.push(productIdToProductNameColumn);

    for (let key in purchaseOrderDetailColumnTitles) {
      const col: ColumnDef<PurchaseOrderDetail> =
        defaultColumn<PurchaseOrderDetail>(
          key,
          purchaseOrderDetailColumnTitles,
        );
      columns.push(col);
    }
    columns.push(totalColumn);

    return columns;
  };

const totalColumn: ColumnDef<PurchaseOrderDetail> = {
  accessorKey: "total",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Total" />
  ),
  cell: ({ row }) => {
    const detail = row.original;
    return (
      <p className="text-[0.8rem]">
        {detail.price * detail.quantity - detail.discount}
      </p>
    );
  },
};

const productIdToProductNameColumn: ColumnDef<PurchaseOrderDetail> = {
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

const creatorIdColumn: ColumnDef<PurchaseOrder> = {
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

const supplierIdColumn: ColumnDef<PurchaseOrder> = {
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