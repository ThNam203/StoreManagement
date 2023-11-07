"use client";

import { defaultColumn, defaultSelectColumn, defaultIndexColumn } from "@/components/ui/my_table_default_column";
import Product from "@/entities/Product";
import { ColumnDef } from "@tanstack/react-table";

export const columnTitles = {
  id: 'Product ID',
  name: 'Product Name',
  barcode: 'Barcode',
  location: 'Location',
  costOfGoods: 'Original Price', // originalPrice
  sellingPrice: 'Sell Price',
  quantity: 'Quantity',
  status: 'Status',
  description: 'Description',
  note: 'Note',
  minInventoryThreshold: 'Min Threshold', // minQuantity
  maxInventoryThreshold: 'Max Threshold', // maxQuantity
  productGroup: 'Product Group',
  productBrand: 'Product Brand',
  productProperty: 'Product Property',
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