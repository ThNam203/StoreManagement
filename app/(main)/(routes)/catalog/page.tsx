"use client";
import { Button } from "@/components/ui/button";
import {
  ChoicesFilter,
  PageWithFilters,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";
import { useState } from "react";

const productTypeFilterChoices = ['Goods', 'Services', 'Combo - Package']
const productGroupFilterChoices = ['Cigarette', 'Milk', 'Soft drink', 'Cosmetics', 'Pastry', 'Alcoholic drinks', 'Fast food']
const productInventoryThresholdFilterChoices = ['All', 'Below threshold', 'Exceeding threshold', 'Available in inventory', 'Out of stock']
const productSupplierFilterChoices = ['Company A', 'Company B', 'Company C', 'Company D', 'Company E', 'Company F']
const productPositionFilterChoices = ['Location A', 'Location B', 'Location C', 'Location D', 'Location E', 'Location F', 'Location G']
const productStatusFilterChoices = ['Selling', 'Not selling', 'All']

const headerButtons = [<Button key={1}>More+</Button>];

export default function Catalog() {
  const [filtersChoice, setFiltersChoice] = useState<{
    type: string[];
    group: string[];
    inventoryThreshold: string;
    supplier: string[];
    position: string[];
    status: string;
  }>({
    type: ['Goods'],
    group: [],
    inventoryThreshold: 'All',
    supplier: [],
    position: [],
    status: 'All',
  });

  const updateTypeFilter = (choices: string[]) => setFiltersChoice((prev) => ({...prev, type: choices}))
  const updateGroupFilter = (choices: string[]) => setFiltersChoice((prev) => ({...prev, group: choices}))
  const updateInventoryThresholdFilter = (choice: string) => setFiltersChoice((prev) => ({...prev, inventoryThreshold: choice}))
  const updateSupplierFilter = (choices: string[]) => setFiltersChoice((prev) => ({...prev, supplier: choices}))
  const updatePositionFilter = (choices: string[]) => setFiltersChoice((prev) => ({...prev, position: choices}))
  const updateStatusFilter = (choice: string) => setFiltersChoice((prev) => ({...prev, status: choice}))

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

  return (
    <PageWithFilters
      title="Products"
      filters={filters}
      headerButtons={headerButtons}
    >
      <p>HEHEHEHEHHEHEHEHEHHEHE</p>
    </PageWithFilters>
  );
}
