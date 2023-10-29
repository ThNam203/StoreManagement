"use client";
import { Button } from "@/components/ui/button";
import {
  ChoicesFilter,
  PageWithFilters,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CatalogDatatable } from "./datatable";
import Media from "@/entities/Media";
import Product from "@/entities/Product";

const productTypeFilterChoices = ["Goods", "Services", "Combo - Package"];
const productGroupFilterChoices = [
  "Cigarette",
  "Milk",
  "Soft drink",
  "Cosmetics",
  "Pastry",
  "Alcoholic drinks",
  "Fast food",
];
const productInventoryThresholdFilterChoices = [
  "All",
  "Below threshold",
  "Exceeding threshold",
  "Available in inventory",
  "Out of stock",
];
const productSupplierFilterChoices = [
  "Company A",
  "Company B",
  "Company C",
  "Company D",
  "Company E",
  "Company F",
];
const productPositionFilterChoices = [
  "Location A",
  "Location B",
  "Location C",
  "Location D",
  "Location E",
  "Location F",
  "Location G",
];
const productStatusFilterChoices = ["Selling", "Not selling", "All"];

const anotherProduct: Product = {
  id: 2,
  name: "Another Sample Product",
  barcode: "XYZ789",
  location: "Aisle 2, Shelf 3",
  costOfGoods: 15.0,
  sellingPrice: 25.0,
  quantity: 50,
  status: "In Stock",
  description: "Another sample product description.",
  note: "Additional notes for the second product.",
  minInventoryThreshold: 5,
  maxInventoryThreshold: 100,
  productGroup: "Clothing",
  productBrand: "Another Brand",
  productProperty: "Medium",
  images: new Set<Media>([
    {
      id: 2,
      url: "https://example.com/another-product-image.jpg",
    },
    {
      id: 3,
      url: "https://example.com/another-product-image2.jpg",
    },
  ]),
};

export default function Catalog() {
  const [filtersChoice, setFiltersChoice] = useState<{
    type: string[];
    group: string[];
    inventoryThreshold: string;
    supplier: string[];
    position: string[];
    status: string;
  }>({
    type: ["Goods"],
    group: [],
    inventoryThreshold: "All",
    supplier: [],
    position: [],
    status: "All",
  });

  const updateTypeFilter = (choices: string[]) =>
    setFiltersChoice((prev) => ({ ...prev, type: choices }));
  const updateGroupFilter = (choices: string[]) =>
    setFiltersChoice((prev) => ({ ...prev, group: choices }));
  const updateInventoryThresholdFilter = (choice: string) =>
    setFiltersChoice((prev) => ({ ...prev, inventoryThreshold: choice }));
  const updateSupplierFilter = (choices: string[]) =>
    setFiltersChoice((prev) => ({ ...prev, supplier: choices }));
  const updatePositionFilter = (choices: string[]) =>
    setFiltersChoice((prev) => ({ ...prev, position: choices }));
  const updateStatusFilter = (choice: string) =>
    setFiltersChoice((prev) => ({ ...prev, status: choice }));

  const filters = [
    <ChoicesFilter
      key={1}
      title="Product type"
      defaultValues={filtersChoice.type}
      isSingleChoice={false}
      choices={productTypeFilterChoices}
      onMultiChoicesChanged={updateTypeFilter}
    />,
    <SearchFilter
      key={2}
      placeholder="Find group..."
      title="Product group"
      chosenValues={filtersChoice.group}
      choices={productGroupFilterChoices}
      onValuesChanged={updateGroupFilter}
      className="my-4"
    />,
    <ChoicesFilter
      key={4}
      title="Inventory"
      isSingleChoice
      defaultValue={filtersChoice.inventoryThreshold}
      choices={productInventoryThresholdFilterChoices}
      onSingleChoiceChanged={updateInventoryThresholdFilter}
      className="my-4"
    />,
    <SearchFilter
      key={5}
      title="Supplier"
      placeholder="Find supplier..."
      chosenValues={filtersChoice.supplier}
      onValuesChanged={updateSupplierFilter}
      choices={productSupplierFilterChoices}
      className="my-4"
    />,
    <SearchFilter
      key={5}
      title="Product position"
      placeholder="Find position..."
      chosenValues={filtersChoice.position}
      onValuesChanged={updatePositionFilter}
      choices={productPositionFilterChoices}
      className="my-4"
    />,
    <ChoicesFilter
      key={4}
      title="Product status"
      isSingleChoice
      defaultValue={filtersChoice.status}
      choices={productStatusFilterChoices}
      onSingleChoiceChanged={updateStatusFilter}
      className="my-4"
    />,
  ];

  const NewProductFirstTab = () => {
    return <div className="flex flex-row">
      <div className="flex flex-row ">
        
      </div>
    </div>;
  };

  const NewProductView = () => {
    const [tabPosition, setTabPosition] = useState(0);

    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-30 z-[9999999999]">
        <div className="rounded-md max-h-[95%] w-[95%] max-w-[960px] flex flex-col p-4 bg-white">
          <h3 className="font-semibold text-base mb-4">Add new product</h3>
          <div className="flex flex-row">
            <p
              className={cn(
                "text-sm lg:text-base w-[180px] text-center hover:cursor-pointer",
                tabPosition === 0 ? "border-b border-blue-400" : ""
              )}
              onClick={() => setTabPosition(0)}
            >
              Information
            </p>
            <p
              className={cn(
                "text-sm lg:text-base w-[180px] text-center hover:cursor-pointer",
                tabPosition === 1 ? "border-b border-blue-400" : ""
              )}
              onClick={() => setTabPosition(1)}
            >
              Detail description
            </p>
            <p
              className={cn(
                "text-sm lg:text-base w-[180px] text-center hover:cursor-pointer",
                tabPosition === 2 ? "border-b border-blue-400" : ""
              )}
              onClick={() => setTabPosition(2)}
            >
              Components
            </p>
          </div>
          <div>{tabPosition === 0 ? <NewProductFirstTab /> : null}</div>
        </div>
      </div>
    );
  };

  return (
    <PageWithFilters
      title="Products"
      filters={filters}
      headerButtons={[]}
    >
      <CatalogDatatable data={[anotherProduct]} />
      {/* <NewProductView /> */}
    </PageWithFilters>
  );
}
