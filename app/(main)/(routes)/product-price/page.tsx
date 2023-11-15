"use client";
import { PageWithFilters, SearchFilter } from "@/components/ui/filter";
import { useState } from "react";
import { ProductPriceTablesDatatable } from "./datatable";

export default function PriceSettings() {
  const [filtersChoice, setFiltersChoice] = useState<{
    priceTables: string[];
    group: string[];
  }>({
    priceTables: [],
    group: [],
  });

  const priceTables = ["General Table", "Black Friday", "Holy Xmas"];
  const productGroupFilterChoices = [
    "Cigarette",
    "Milk",
    "Soft drink",
    "Cosmetics",
    "Pastry",
    "Alcoholic drinks",
    "Fast food",
  ];

  const updatePriceTablesFilter = (choices: string[]) =>
    setFiltersChoice((prev) => ({ ...prev, priceTables: choices }));
  const updateGroupFilter = (choices: string[]) =>
    setFiltersChoice((prev) => ({ ...prev, group: choices }));

  const filters = [
    <SearchFilter
      key={1}
      placeholder="Find price table..."
      title="Price tables"
      chosenValues={filtersChoice.priceTables}
      choices={priceTables}
      onValuesChanged={updatePriceTablesFilter}
      className="mb-4"
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
  ];

  return (
    <PageWithFilters title="Price setting" filters={filters}>
      <ProductPriceTablesDatatable />
    </PageWithFilters>
  );
}
