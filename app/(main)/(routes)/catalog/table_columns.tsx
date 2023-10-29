"use client";

import { defaultColumn, defaultSelectColumn, defaultIndexColumn } from "@/components/ui/my_table_default_column";
import Product from "@/entities/Product";
import { ColumnDef } from "@tanstack/react-table";

export const columnTitles = {
  image: 'Image',
  productId: 'ID',
  barcode: 'Barcode',
  productName: 'Name',
  productGroup: 'Product group',
  productType: 'Product type',
  costOfGoods: 'Cost of goods',
  sellingPrice: 'Selling price',
  brand: 'Brand',
  inventoryQuantity: 'Inventory quantity',
  position: 'Position',
  minimumInventoryThreshold: 'Minimum inventory threshold',
  maximumInventoryThreshold: 'Maximum inventory threshold',
  status: 'Status',
};

export const productTableColumns = (): ColumnDef<Product>[] => {
  const columns: ColumnDef<Product>[] = [
    defaultSelectColumn<Product>(),
    defaultIndexColumn<Product>(),
  ]

  for (let key in columnTitles) {
    const col: ColumnDef<Product> = defaultColumn<Product>(key, columnTitles);
    columns.push(col);
  }

  return columns;
}