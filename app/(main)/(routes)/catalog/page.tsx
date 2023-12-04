"use client";
import {
  ChoicesFilter,
  PageWithFilters,
  SearchFilter,
} from "@/components/ui/filter";
import React, { useEffect, useState } from "react";
import { CatalogDatatable } from "./datatable";
import { NewProductView } from "@/components/ui/catalog/new_product_form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductService from "@/services/product_service";
import { useToast } from "@/components/ui/use-toast";
import { UpdateProductView } from "@/components/ui/catalog/update_product_form";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { addGroup } from "@/reducers/productGroupsReducer";
import { addBrand } from "@/reducers/productBrandsReducer";
import { addLocation } from "@/reducers/productLocationsReducer";
import * as productPropertiesActions from "@/reducers/productPropertiesReducer";
import { addProducts, updateProduct } from "@/reducers/productsReducer";

const productInventoryThresholds = [
  "All",
  "Below threshold",
  "Exceeding threshold",
  "Available in inventory",
  "Out of stock",
];
const productStatuses = ["Active", "Disabled", "All"];

export default function Catalog() {
  const { toast } = useToast();
  const products = useAppSelector((state) => state.products.value)
  const productGroups = useAppSelector((state) => state.productGroups.value)
  const productLocations = useAppSelector((state) => state.productLocations.value)
  const dispatch = useAppDispatch();

  const addNewGroup = async (group: string) => {
    try {
      const data = await ProductService.createNewGroup(group);
      dispatch(addGroup(data.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const addNewBrand = async (brandName: string) => {
    try {
      const data = await ProductService.createNewBrand(brandName);
      dispatch(addBrand(data.data))
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const addNewLocation = async (location: string) => {
    try {
      const data = await ProductService.createNewLocation(location);
      dispatch(addLocation(data.data))
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const addNewProperty = async (property: string) => {
    try {
      const data = await ProductService.createNewProperty(property);
      dispatch(productPropertiesActions.addProperty(data.data))
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const updateProperty = async (newValue: string, propertyId: number) => {
    try {
      const data = await ProductService.updateProperty(newValue, propertyId);
      dispatch(productPropertiesActions.updateProperty(data.data))
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const deleteProperty = async (propertyId: number) => {
    try {
      await ProductService.deleteProperty(propertyId)
      dispatch(productPropertiesActions.deleteProperty(propertyId))
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

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
    <SearchFilter
      key={2}
      placeholder="Find group..."
      title="Product group"
      chosenValues={filtersChoice.group}
      choices={productGroups.map((group) => group.name)}
      onValuesChanged={updateGroupFilter}
      className="mb-4"
    />,
    <ChoicesFilter
      key={3}
      title="Inventory"
      isSingleChoice
      defaultValue={filtersChoice.inventoryThreshold}
      choices={productInventoryThresholds}
      onSingleChoiceChanged={updateInventoryThresholdFilter}
      className="my-4"
    />,
    <SearchFilter
      key={5}
      title="Product position"
      placeholder="Find position..."
      chosenValues={filtersChoice.position}
      onValuesChanged={updatePositionFilter}
      choices={productLocations.map((v) => v.name)}
      className="my-4"
    />,
    <ChoicesFilter
      key={6}
      title="Product status"
      isSingleChoice
      defaultValue={filtersChoice.status}
      choices={productStatuses}
      onSingleChoiceChanged={updateStatusFilter}
      className="my-4"
    />,
  ];

  const NewProductButton = () => {
    return (
      <Button variant={"green"} onClick={() => setShowNewProductView(true)}>
        <Plus size={16} className="mr-2" />
        New product
      </Button>
    );
  };

  const [showNewProductView, setShowNewProductView] = useState(false);
  const [showUpdateProductView, setShowUpdateProductView] = useState(false);
  const [chosenProductIndex, setChosenProductIndex] = useState<number | null>(
    null
  );

  const onProductUpdateButtonClicked = (rowIndex: number) => {
    setChosenProductIndex(rowIndex);
    setShowUpdateProductView(true);
  };

  return (
    <PageWithFilters
      title="Products"
      filters={filters}
      headerButtons={[<NewProductButton key={1} />]}
    >
      <CatalogDatatable
        data={products}
        onProductUpdateButtonClicked={onProductUpdateButtonClicked}
      />
      {showNewProductView ? (
        <NewProductView
          onChangeVisibility={setShowNewProductView}
          onNewProductsAdded={(newProducts) =>
            dispatch(addProducts(newProducts))
          }
          addNewBrand={addNewBrand}
          addNewGroup={addNewGroup}
          addNewLocation={addNewLocation}
          addNewProperty={addNewProperty}
          onUpdateProperty={updateProperty}
          onDeleteProperty={deleteProperty}
        />
      ) : null}
      {showUpdateProductView &&
      chosenProductIndex != null &&
      chosenProductIndex > -1 &&
      chosenProductIndex < products.length ? (
        <UpdateProductView
          onChangeVisibility={(val) => {
            setShowUpdateProductView(val);
          }}
          product={products[chosenProductIndex]}
          productIndex={chosenProductIndex}
          onProductUpdated={(data) => dispatch(updateProduct(data))}
          addNewBrand={addNewBrand}
          addNewGroup={addNewGroup}
          addNewLocation={addNewLocation}
          addNewProperties={addNewProperty}
          onUpdateProperty={updateProperty}
          onDeleteProperty={deleteProperty}
        />
      ) : null}
    </PageWithFilters>
  );
}
