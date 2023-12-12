"use client";

import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import {
  defaultColumn,
  defaultSelectColumn,
  defaultIndexColumn,
} from "@/components/ui/my_table_default_column";
import {Product} from "@/entities/Product";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const catalogDefaultVisibilityState = {
  id: true,
  name: true,
  barcode: false,
  location: false,
  originalPrice: true,
  productPrice: true,
  stock: true,
  status: true,
  description: true,
  note: true,
  minStock: false,
  maxStock: false,
  productGroup: false,
  productBrand: false,
  productProperties: false,
  images: true,
  salesUnits: false,
  weight: false,
}

export const catalogColumnTitles = {
  id: "Product ID",
  name: "Product Name",
  images: "Image",
  barcode: "Barcode",
  location: "Location",
  originalPrice: "Original Price", // originalPrice
  productPrice: "Sell Price",
  stock: "Stock",
  status: "Status",
  weight: "Weight",
  description: "Description",
  note: "Note",
  minStock: "Min Stock", // minQuantity
  maxStock: "Max Stock", // maxQuantity
  productGroup: "Product Group",
  productBrand: "Product Brand",
  productProperties: "Product Property",
  salesUnits: "Unit",
};

export const catalogTableColumns = (): ColumnDef<Product>[] => {
  const columns: ColumnDef<Product>[] = [
    defaultSelectColumn<Product>(),
    defaultIndexColumn<Product>(),
  ];

  for (let key in catalogColumnTitles) {
    let col: ColumnDef<Product>;
    if (key === "images") col = imageColumn(key, catalogColumnTitles[key])
    else if (key === "productProperties") col = propertiesColumn(key, catalogColumnTitles[key])
    else if (key === 'salesUnits') col = unitColumn(key, catalogColumnTitles[key])
    else col = defaultColumn<Product>(key, catalogColumnTitles);
    columns.push(col);
  }

  return columns;
};

function imageColumn(accessorKey: string, title: string): ColumnDef<Product> {
  const col: ColumnDef<Product> = {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const value: string[] = row.getValue(accessorKey);
      return (
        <Image
          alt="product image"
          width={30}
          height={30}
          src={value && value[0] ? value[0] : "/default-product-img.jpg"}
          className="object-contain mx-auto"
        />
      );
    },
    enableSorting: false,
  };
  return col;
}

function propertiesColumn(accessorKey: string, title: string): ColumnDef<Product> {
  const col: ColumnDef<Product> = {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const value: {
        id: number,
        propertyName: string,
        propertyValue: string,
      }[] = row.getValue(accessorKey);

      const propertyString = value ? value.map((property) => {
        return property.propertyName + " - " + property.propertyValue
      }).join(", ") : ""

      return (
        <p className="text-[0.8rem]">{propertyString}</p>
      );
    },
  };
  return col;
}

function unitColumn(accessorKey: string, title: string): ColumnDef<Product> {
  const col: ColumnDef<Product> = {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const value: {
        id: number;
        basicUnit: string;
        name: string;
        exchangeValue: number;
    } = row.getValue(accessorKey);

      return (
        <p className="text-[0.8rem]">{value.name}</p>
      );
    },
  };
  return col;
}