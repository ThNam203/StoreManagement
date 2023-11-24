"use client";
import {
  ChoicesFilter,
  PageWithFilters,
  SearchFilter,
} from "@/components/ui/filter";
import React, { useEffect, useState } from "react";
import { CatalogDatatable } from "./datatable";
import {
  Product,
  ProductBrand,
  ProductGroup,
  ProductLocation,
  ProductProperty,
} from "@/entities/Product";
import { Toaster } from "@/components/ui/toaster";
import { NewProductView } from "@/components/ui/catalog/new_product_form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CatalogService from "@/services/catalog_service";
import { useToast } from "@/components/ui/use-toast";
import { UpdateProductView } from "@/components/ui/catalog/update_product_form";
import AxiosService from "@/services/axios_service";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useAppDispatch } from "@/hooks";
import { showPreloader, disablePreloader } from "@/reducers/preloaderReducer";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [productLocations, setProductLocations] = useState<ProductLocation[]>(
    []
  );
  const [productBrands, setProductBrands] = useState<ProductBrand[]>([]);
  const [productProperties, setProductProperties] = useState<ProductProperty[]>(
    []
  );
  const dispatch = useAppDispatch();

  const addNewGroup = async (group: string) => {
    try {
      const data = await CatalogService.createNewGroup(group);
      setProductGroups((prev) => [...prev, data.data]);
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const addNewBrand = async (brandName: string) => {
    try {
      const data = await CatalogService.createNewBrand(brandName);
      setProductBrands((prev) => [...prev, data.data]);
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const addNewLocation = async (location: string) => {
    try {
      const data = await CatalogService.createNewLocation(location);
      setProductLocations((prev) => [...prev, data.data]);
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const addNewProperty = async (property: string) => {
    try {
      const data = await CatalogService.createNewProperty(property);
      setProductProperties((prev) => [...prev, data.data]);
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const updateProperty = async (newValue: string, propertyId: number) => {
    try {
      const data = await CatalogService.updateProperty(newValue, propertyId);
      setProductProperties((prev) =>
        prev.map((property) =>
          propertyId === property.id ? data.data : property
        )
      );
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const deleteProperty = async (propertyId: number) => {
    try {
      await CatalogService.deleteProperty(propertyId);
      setProductProperties((prev) =>
        prev.filter((property) => propertyId !== property.id)
      );
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showPreloader());
      try {
        const products = await CatalogService.getAllProducts();
        setProducts(products.data);

        const brandsResult = await CatalogService.getAllBrands();
        setProductBrands(brandsResult.data);

        const locationsResult = await CatalogService.getAllLocations();
        setProductLocations(locationsResult.data);

        const propertiesResult = await CatalogService.getAllProperties();
        setProductProperties(propertiesResult.data);

        const groupsResult = await CatalogService.getAllGroups();
        setProductGroups(groupsResult.data);
        dispatch(disablePreloader());
      } catch (error) {
        dispatch(disablePreloader());
        axiosUIErrorHandler(error, toast);
      }
    };
    fetchData();
  }, []);

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

  const onRowClicked = (rowIndex: number) => {
    setChosenProductIndex(rowIndex);
  };

  const onProductUpdateButtonClicked = () => {
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
        onRowClicked={onRowClicked}
        onProductUpdateButtonClicked={onProductUpdateButtonClicked}
      />
      {showNewProductView ? (
        <NewProductView
          productBrands={productBrands}
          productGroups={productGroups}
          productLocations={productLocations}
          productProperties={productProperties}
          onChangeVisibility={setShowNewProductView}
          onNewProductsAdded={(newProducts) =>
            setProducts((prev) => [...prev, ...newProducts])
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
          productBrands={productBrands}
          productGroups={productGroups}
          productLocations={productLocations}
          productProperties={productProperties}
          product={products[chosenProductIndex]}
          productIndex={chosenProductIndex}
          onProductUpdated={(data, index) => {
            setProducts((prev) => {
              prev[index] = data;
              return [...prev];
            });
          }}
          addNewBrand={addNewBrand}
          addNewGroup={addNewGroup}
          addNewLocation={addNewLocation}
          addNewProperties={addNewProperty}
          onUpdateProperty={updateProperty}
          onDeleteProperty={deleteProperty}
        />
      ) : null}
      <Toaster />
    </PageWithFilters>
  );
}
