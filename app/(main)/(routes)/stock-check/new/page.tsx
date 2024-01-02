"use client";
import SearchView from "@/components/component/SearchView";
import CustomAlertDialog from "@/components/component/custom_alert_dialog";
import { CustomDatatable } from "@/components/component/custom_datatable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PropertiesString from "@/components/ui/properties_string_view";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/entities/Product";
import { StockCheckDetail } from "@/entities/StockCheck";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { setProducts } from "@/reducers/productsReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import ProductService from "@/services/productService";
import StockCheckService from "@/services/stockCheckService";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  stockCheckDetailColumnTitles,
  stockCheckDetailTableColumns,
} from "./table_columns";

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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [details, setDetails] = useState<StockCheckDetail[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [note, setNote] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(showPreloader());
    const getData = async () => {
      try {
        const products = await ProductService.getAllProducts();
        dispatch(setProducts(products.data));
      } catch (e) {
        axiosUIErrorHandler(e, toast, router);
      }
    };
    getData().finally(() => {
      dispatch(disablePreloader());
    });
  }, []);

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
    const productIds = data.map((d) => d.productId);
    setDetails((prev) =>
      prev.filter((detail) => productIds.includes(detail.productId)),
    );
    return Promise.resolve();
  };

  const onCompleteButtonClick = async () => {
    await StockCheckService.uploadNewStockCheck({
      products: details,
      note: note,
    })
      .then((result) => {
        router.push("/stock-check");
      })
      .catch((e) => axiosUIErrorHandler(e, toast, router))
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
            placeholder="Note..."
            className="w-full md:max-w-[500px]"
            value={note}
            onChange={(e) => setNote(e.currentTarget.value)}
          />
          <CustomAlertDialog
            title="Update catalog"
            description="The products's stock in catalog will be changed base on the stock check. Make sure you will want to continue?"
            trigger={
              <Button variant={"green"} disabled={isCompleting}>
                <CheckCircle size={16} className="mr-2" />
                Complete
              </Button>
            }
            onContinueClick={onCompleteButtonClick}
          />
        </div>
      </div>
    </div>
  );
}
