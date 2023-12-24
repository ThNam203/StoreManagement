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
import { ChevronRight, Lock, PenLine, Plus, Trash } from "lucide-react";
import ProductService from "@/services/productService";
import { useToast } from "@/components/ui/use-toast";
import { UpdateProductView } from "@/components/ui/catalog/update_product_form";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { addGroup, setGroups } from "@/reducers/productGroupsReducer";
import { addBrand, setBrands } from "@/reducers/productBrandsReducer";
import { addLocation, setLocations } from "@/reducers/productLocationsReducer";
import * as productPropertiesActions from "@/reducers/productPropertiesReducer";
import {
  addProducts,
  setProducts,
  updateProduct,
} from "@/reducers/productsReducer";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { handleMultipleFilter, handleSingleFilter } from "@/utils";
import { Product } from "@/entities/Product";

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
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.value);
  const productGroups = useAppSelector((state) => state.productGroups.value);
  const productLocations = useAppSelector(
    (state) => state.productLocations.value,
  );

  useEffect(() => {
    dispatch(showPreloader());
    const getData = async () => {
      try {
        const products = await ProductService.getAllProducts();
        dispatch(setProducts(products.data));

        const productGroups = await ProductService.getAllGroups();
        dispatch(setGroups(productGroups.data));

        const productLocations = await ProductService.getAllLocations();
        dispatch(setLocations(productLocations.data));

        const productBrands = await ProductService.getAllBrands();
        dispatch(setBrands(productBrands.data));

        const productProperties = await ProductService.getAllProperties();
        dispatch(
          productPropertiesActions.setProperties(productProperties.data),
        );
      } catch (e) {
        axiosUIErrorHandler(e, toast);
      }
    };
    getData().finally(() => {
      dispatch(disablePreloader());
    });
  }, []);

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
      dispatch(addBrand(data.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const addNewLocation = async (location: string) => {
    try {
      const data = await ProductService.createNewLocation(location);
      dispatch(addLocation(data.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const addNewProperty = async (property: string) => {
    try {
      const data = await ProductService.createNewProperty(property);
      dispatch(productPropertiesActions.addProperty(data.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const updateProperty = async (newValue: string, propertyId: number) => {
    try {
      const data = await ProductService.updateProperty(newValue, propertyId);
      dispatch(productPropertiesActions.updateProperty(data.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const deleteProperty = async (propertyId: number) => {
    try {
      await ProductService.deleteProperty(propertyId);
      dispatch(productPropertiesActions.deleteProperty(propertyId));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const [filteredProductList, setFilterSaleList] =
    useState<Product[]>(products);
  let [multiFilter, setMultiFilter] = useState({
    // type: ["Goods"] as string[],
    productGroup: [] as string[],
    // supplier: [] as string[],
    location: [] as string[],
  });
  let [singleFileter, setSingleFilter] = useState({
    // minStock: "All" as string | undefined,
    // status: "All" as string | undefined,
  });

  useEffect(() => {
    let filteredList = [...products];
    console.log("multi filter", multiFilter);
    filteredList = handleMultipleFilter<Product>(multiFilter, filteredList);
    console.log("filtered list", filteredList);
    filteredList = handleSingleFilter<Product>(singleFileter, filteredList);

    setFilterSaleList([...filteredList]);
  }, [multiFilter, singleFileter, products]);

  const updateTypeFilter = (choices: string[]) =>
    setMultiFilter((prev) => ({ ...prev, type: choices }));
  const updateProductGroupFilter = (choices: string[]) =>
    setMultiFilter((prev) => ({ ...prev, productGroup: choices }));
  const updateInventoryThresholdFilter = (choice: string) => {
    // if (choice === "All") {
    //   const newSingleFilter = { ...singleFileter };
    //   delete newSingleFilter.minStock;
    //   setSingleFilter(newSingleFilter);
    // } else if (choice === "Below threshold") {
    //   setSingleFilter((prev) => ({ ...prev, minStock: choice }));
    // }
    // setSingleFilter((prev) => ({ ...prev, minStock: choice }));
  };
  const updateSupplierFilter = (choices: string[]) =>
    setMultiFilter((prev) => ({ ...prev, supplier: choices }));
  const updateLocationFilter = (choices: string[]) =>
    setMultiFilter((prev) => ({ ...prev, location: choices }));
  const updateStatusFilter = (choice: string) => {
    // if (choice === "All") {
    //   const newSingleFilter = { ...singleFileter };
    //   delete newSingleFilter.status;
    //   setSingleFilter(newSingleFilter);
    // } else setSingleFilter((prev) => ({ ...prev, status: choice }));
  };

  const filters = [
    <SearchFilter
      key={2}
      placeholder="Find group..."
      title="Product group"
      chosenValues={multiFilter.productGroup}
      choices={productGroups.map((group) => group.name)}
      onValuesChanged={updateProductGroupFilter}
      className="mb-4"
    />,
    // <ChoicesFilter
    //   key={3}
    //   title="Inventory"
    //   isSingleChoice
    //   defaultValue={singleFileter.minStock}
    //   choices={productInventoryThresholds}
    //   onSingleChoiceChanged={updateInventoryThresholdFilter}
    //   className="my-4"
    // />,
    <SearchFilter
      key={5}
      title="Product position"
      placeholder="Find position..."
      chosenValues={multiFilter.location}
      onValuesChanged={updateLocationFilter}
      choices={productLocations.map((v) => v.name)}
      className="my-4"
    />,
    // <ChoicesFilter
    //   key={6}
    //   title="Product status"
    //   isSingleChoice
    //   defaultValue={singleFileter.status}
    //   choices={productStatuses}
    //   onSingleChoiceChanged={updateStatusFilter}
    //   className="my-4"
    // />,
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
    null,
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
        data={filteredProductList}
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
