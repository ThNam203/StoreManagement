"use client";
import { CustomDatatable } from "@/components/component/custom_datatable";
import PropertiesString from "@/components/ui/properties_string_view";
import SearchView from "@/components/ui/search_view";
import { Product } from "@/entities/Product";
import { useAppSelector } from "@/hooks";
import { useState } from "react";
import {
  stockCheckDetailColumnTitles,
  stockCheckDetailTableColumns,
} from "./table_columns";
import { StockCheckDetail } from "@/entities/StockCheck";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import StockCheckService from "@/services/stock_check_service";
import LoadingCircle from "@/components/ui/loading_circle";
import axios from "axios";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useToast } from "@/components/ui/use-toast";

const ProductSearchItemView: (product: Product) => React.ReactNode = (
  product: Product,
) => {
  return (
    <div className="m-1 flex flex-row items-center gap-2 rounded-sm p-1 px-4 hover:cursor-pointer hover:bg-blue-200">
      <img
        className="h-10 w-10 border object-contain object-center"
        src={
          product.images && product.images.length > 0
            ? product.images[0]
            : "/default-product-img.jpg"
        }
      />
      <div className="flex flex-1 flex-col text-sm">
        <p className="font-semibold">
          {product.name}
          <PropertiesString
            propertiesString={product.propertiesString}
            className="ml-1"
          />
        </p>
        <p>ID: {product.id}</p>
        <p>In stock: {product.stock}</p>
      </div>
      <p className="text-base text-blue-400">
        {product.productPrice}/{product.salesUnits.name}
      </p>
    </div>
  );
};

export default function NewStockCheckPage() {
  const products = useAppSelector((state) => state.products.value);
  const [details, setDetails] = useState<StockCheckDetail[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [note, setNote] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();

  const onSearchViewProductClicked = (product: Product) => {
    const foundProduct = details.find(
      (detail) => detail.productId === product.id,
    );
    if (!foundProduct)
      setDetails((prev) => [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          productProperties: product.productProperties
            ? product.productProperties
                .map(
                  (property) =>
                    property.propertyName + " - " + property.propertyValue,
                )
                .join(", ")
            : "",
          unitName: product.salesUnits.name,
          diffQuantity: 1 - product.stock,
          diffCost: (1 - product.stock) * product.productPrice,
          countedStock: 1,
          realStock: product.stock,
          price: product.productPrice,
        },
      ]);
    else onDetailQuantityChanged(product.id, foundProduct.countedStock + 1);
  };

  const onDetailQuantityChanged = (productId: number, newQuantity: number) => {
    if (isNaN(newQuantity) || newQuantity < 0) newQuantity = 0;
    setDetails((prev) =>
      prev.map((detail) => {
        return detail.productId === productId
          ? {
              ...detail,
              diffQuantity: newQuantity - detail.realStock,
              diffCost: (newQuantity - detail.realStock) * detail.price,
              countedStock: newQuantity,
            }
          : detail;
      }),
    );
  };

  const deleteRows = async (data: StockCheckDetail[]) => {
    console.log("ddmmmm chay di")
    const productIds = data.map((d) => d.productId);
    setDetails((prev) =>
      prev.filter((detail) => productIds.includes(detail.productId)),
    );
    return Promise.resolve()
  };

  const onClickButtonClick = () => {
    setIsCompleting(true);
    StockCheckService.uploadNewStockCheck({ products: details, note: note })
      .then((result) => {
        console.log(result.data);
      })
      .catch((e) => axiosUIErrorHandler(e, toast))
      .finally(() => setIsCompleting(false));
  };

  const MSearchView = (
    <SearchView
      placeholder="Find products by id or name"
      className="max-w-[400px] flex-1"
      triggerClassname="border"
      choices={products}
      onSearchChange={(value) => setProductSearch(value)}
      itemView={ProductSearchItemView}
      onItemClick={onSearchViewProductClicked}
      filter={(product) =>
        product.id.toString().includes(productSearch) ||
        product.name.includes(productSearch)
      }
      zIndex={8}
    />
  );

  return (
    <div className="flex flex-col gap-2">
      <h2 className="my-4 flex-1 text-start text-2xl font-bold">
        Create new stock check
      </h2>
      <div className="flex flex-col gap-4">
        <div className="bg-white p-2">
          <CustomDatatable
            data={details}
            columns={stockCheckDetailTableColumns(onDetailQuantityChanged)}
            columnTitles={stockCheckDetailColumnTitles}
            config={{
              alternativeSearchInput: MSearchView,
              onDeleteRowsBtnClick: deleteRows,
            }}
          />
        </div>
        <div className="flex flex-col gap-4 bg-white p-4 md:flex-row">
          <div className="min-w-0 flex-1" />
          <Input
            showBorderOnFocus={false}
            placeholder="Note..."
            className="w-full md:max-w-[500px]"
            value={note}
            onChange={(e) => setNote(e.currentTarget.value)}
          />
          <Button variant={"green"} disabled={isCompleting}>
            <CheckCircle
              size={16}
              className="mr-2"
              onClick={() => {
                onClickButtonClick();
              }}
            />
            Complete
            {isCompleting ? <LoadingCircle /> : null}
          </Button>
        </div>
      </div>
    </div>
  );
}
