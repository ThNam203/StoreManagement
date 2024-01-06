"use client";
import { Button } from "@/components/ui/button";
import { NewProductView } from "@/components/ui/catalog/new_product_form";
import { UpdateProductView } from "@/components/ui/catalog/update_product_form";
import {
  PageWithFilters,
  SearchFilter,
  SingleChoiceFilter,
} from "@/components/ui/filter";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/entities/Product";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { addBrand, setBrands } from "@/reducers/productBrandsReducer";
import { addGroup, setGroups } from "@/reducers/productGroupsReducer";
import { addLocation, setLocations } from "@/reducers/productLocationsReducer";
import * as productPropertiesActions from "@/reducers/productPropertiesReducer";
import {
  addProducts,
  setProducts,
  updateProduct,
} from "@/reducers/productsReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import ProductService from "@/services/productService";
import { handleChoiceFilters } from "@/utils";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { CatalogDatatable } from "./datatable";
import { useRouter } from "next/navigation";

const PRODUCT_STOCK_LEVEL_FILTERS = [
  "All",
  "Below threshold",
  "Exceeding threshold",
  "Available in inventory",
  "Out of stock",
];

const PRODUCT_STATUSES_FILTERS = ["Active", "Disabled", "All"];

export default function Catalog() {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.value);
  const productGroups = useAppSelector((state) => state.productGroups.value);
  const productBrands = useAppSelector((state) => state.productBrands.value);
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
        axiosUIErrorHandler(e, toast, router);
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
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  };

  const addNewBrand = async (brandName: string) => {
    try {
      const data = await ProductService.createNewBrand(brandName);
      dispatch(addBrand(data.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  };

  const addNewLocation = async (location: string) => {
    try {
      const data = await ProductService.createNewLocation(location);
      dispatch(addLocation(data.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  };

  const addNewProperty = async (property: string) => {
    try {
      const data = await ProductService.createNewProperty(property);
      dispatch(productPropertiesActions.addProperty(data.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  };

  const updateProperty = async (newValue: string, propertyId: number) => {
    try {
      const data = await ProductService.updateProperty(newValue, propertyId);
      dispatch(productPropertiesActions.updateProperty(data.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  };

  const deleteProperty = async (propertyId: number) => {
    try {
      await ProductService.deleteProperty(propertyId);
      dispatch(productPropertiesActions.deleteProperty(propertyId));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  };

  const [filterConditions, setFilterConditions] = useState({
    location: [] as string[],
    productGroup: [] as string[],
    productBrand: [] as string[],
  });

  const [stockLevelCondition, setStockLevelCondition] = useState("All");
  const [statusCondition, setStatusCondition] = useState("All");

  const updateLocationCondition = (values: string[]) => {
    setFilterConditions((prevConditions) => ({
      ...prevConditions,
      location: values,
    }));
  };

  const updateProductGroupCondition = (values: string[]) => {
    setFilterConditions((prevConditions) => ({
      ...prevConditions,
      productGroup: values,
    }));
  };

  const updateProductBrandCondition = (values: string[]) => {
    setFilterConditions((prevConditions) => ({
      ...prevConditions,
      productBrand: values,
    }));
  };

  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    let filteredList = products.filter((product) => !product.isDeleted);
    filteredList = handleChoiceFilters(filterConditions, filteredList);

    filteredList = filteredList.filter((product) => {
      if (stockLevelCondition === "All") return true;
      if (stockLevelCondition === "Below threshold")
        return product.stock < product.minStock;
      if (stockLevelCondition === "Exceeding threshold")
        return product.stock > product.maxStock;
      if (stockLevelCondition === "Available in inventory")
        return product.stock > 0;
      if (stockLevelCondition === "Out of stock") return product.stock === 0;
    });

    filteredList = filteredList.filter((product) => {
      if (statusCondition === "All") return true;
      if (statusCondition === product.status) return true;
      return false;
    });

    setFilteredProducts([...filteredList]);
  }, [filterConditions, products, statusCondition, stockLevelCondition]);

  const filters = [
    <SearchFilter
      key={1}
      placeholder="Find group..."
      title="Product group"
      chosenValues={filterConditions.productGroup}
      choices={productGroups.map((group) => group.name)}
      onValuesChanged={updateProductGroupCondition}
      className="mb-2"
    />,
    <SearchFilter
      key={2}
      placeholder="Find brand..."
      title="Product brand"
      chosenValues={filterConditions.productBrand}
      choices={productBrands.map((brand) => brand.name)}
      onValuesChanged={updateProductBrandCondition}
      className="mb-2"
    />,
    <SearchFilter
      key={3}
      title="Product position"
      placeholder="Find position..."
      chosenValues={filterConditions.location}
      onValuesChanged={updateLocationCondition}
      choices={productLocations.map((v) => v.name)}
      className="mb-2"
    />,
    <SingleChoiceFilter
      key={4}
      title="Stock level"
      choices={PRODUCT_STOCK_LEVEL_FILTERS}
      value={stockLevelCondition}
      onValueChanged={setStockLevelCondition}
      className="mb-2"
    />,
    <SingleChoiceFilter
      key={5}
      title="Status"
      choices={PRODUCT_STATUSES_FILTERS}
      value={statusCondition}
      onValueChanged={setStatusCondition}
      className="mb-2"
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
        data={filteredProducts}
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
      chosenProductIndex < filteredProducts.length ? (
        <UpdateProductView
          onChangeVisibility={(val) => {
            setShowUpdateProductView(val);
          }}
          product={filteredProducts[chosenProductIndex]}
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
