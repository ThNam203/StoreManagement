/* eslint-disable @next/next/no-img-element */
"use client";
import scrollbar_style from "@/styles/scrollbar.module.css";
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as ReactTable,
  flexRender,
  Row,
} from "@tanstack/react-table";
import { Product } from "@/entities/Product";
import {
  catalogColumnTitles,
  catalogDefaultVisibilityState,
  catalogTableColumns,
} from "./table_columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { Ref, RefObject, useEffect, useRef, useState } from "react";
import { DataTablePagination } from "@/components/ui/my_table_pagination";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { ChevronRight, Lock, PenLine, Trash } from "lucide-react";
import { useAppDispatch } from "@/hooks";
import { deleteProduct, updateProduct } from "@/reducers/productsReducer";
import ProductService from "@/services/product_service";
import LoadingCircle from "@/components/ui/loading_circle";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useToast } from "@/components/ui/use-toast";
import { CustomDatatable } from "@/components/component/custom_datatable";

export function CatalogDatatable({
  data,
  onProductUpdateButtonClicked,
}: {
  data: Product[];
  onProductUpdateButtonClicked: (rowIndex: number) => any;
}) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  async function deleteProducts(dataToDelete: Product[]): Promise<void> {
    const promises = dataToDelete.map((product) => {
      return ProductService.deleteProduct(product.id).then((_) =>
        dispatch(deleteProduct(product.id)),
      );
    });

    try {
      Promise.allSettled(promises).then((deletedData) => {
        const successfullyDeleted = deletedData.map(
          (data) => data.status === "fulfilled",
        );
        toast({
          description: `Deleted ${
            successfullyDeleted.length
          } products, failed ${
            deletedData.length - successfullyDeleted.length
          }`,
        });
        return Promise.resolve();
      });
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  }

  return (
    <CustomDatatable
      data={data}
      columns={catalogTableColumns()}
      columnTitles={catalogColumnTitles}
      infoTabs={[
        {
          render(row, setShowTabs) {
            return (
              <DetailProductTab
                row={row}
                setShowTabs={setShowTabs}
                onProductUpdateButtonClicked={onProductUpdateButtonClicked}
              />
            );
          },
          tabName: "Detail",
        },
      ]}
      config={{
        onDeleteRowsBtnClick: deleteProducts, // if null, remove button
        defaultVisibilityState: catalogDefaultVisibilityState,
      }}
    />
  );
}

const DetailProductTab = ({
  row,
  setShowTabs,
  onProductUpdateButtonClicked,
}: {
  row: Row<Product>;
  setShowTabs: (value: boolean) => any;
  onProductUpdateButtonClicked: (rowIndex: number) => any;
}) => {
  const product = row.original;
  const [chosenImagePos, setChosenImagePos] = React.useState<number | null>(
    product.images && product.images.length > 0 ? 0 : null,
  );
  const [disableDisableButton, setDisableDisableButton] = useState(false);
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  return (
    <>
      <h4 className="text-lg font-bold text-blue-800">{product.name}</h4>
      <div className="flex flex-row gap-4">
        <div className="flex max-w-[300px] shrink-[2] grow-[2] flex-col gap-2">
          <AspectRatio
            className="flex w-full items-center justify-center  rounded-sm border-2 border-gray-200"
            ratio={1 / 1}
          >
            <img
              alt="product image"
              src={
                product.images && chosenImagePos !== null
                  ? product.images[chosenImagePos]
                  : "/default-product-img.jpg"
              }
              className="max-h-[300px] w-full max-w-[300px]"
            />
          </AspectRatio>
          {product.images && product.images.length > 0 ? (
            <div className="flex flex-row gap-2">
              {product.images.map((imageLink, idx) => {
                return (
                  <div
                    className={cn(
                      "max-h-[53px] max-w-[60px] border",
                      chosenImagePos === idx
                        ? "border-black"
                        : "border-gray-200",
                    )}
                    key={idx}
                    onClick={(_) => setChosenImagePos(idx)}
                  >
                    <img
                      alt="product image preview"
                      src={imageLink ?? "/default-product-img.jpg"}
                      className="mb-1 object-contain"
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className="flex shrink-[5] grow-[5] flex-row text-[0.8rem]">
          <div className="flex flex-1 flex-col pr-4">
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Product id:</p>
              <p>{product.id}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Product barcode:</p>
              <p>{product.barcode}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Product group:</p>
              {product.productGroup ? <p>{product.productGroup}</p> : null}
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Brand:</p>
              {product.productBrand ? <p>{product.productBrand}</p> : null}
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Stock:</p>
              <p>{product.stock}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Stock quota:</p>
              <div className="flex flex-row items-center">
                <p>{product.minStock}</p>
                <ChevronRight size={14} className="mx-1 p-0" />
                <p>{product.maxStock}</p>
              </div>
            </div>

            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Product price:</p>
              <p>{product.productPrice}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Original price:</p>
              <p>{product.originalPrice}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Weight:</p>
              <p>{product.weight}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Location:</p>
              <p>{product.location}</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col pr-4">
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Status:</p>
              <p>{product.status}</p>
            </div>
            <div>
              <p className="mb-2">Description</p>
              <textarea
                readOnly
                className={cn(
                  "h-[80px] w-full resize-none rounded-sm border-2 p-1",
                  scrollbar_style.scrollbar,
                )}
                defaultValue={product.description}
              ></textarea>
            </div>
            <div>
              <p className="mb-2">Note</p>
              <textarea
                readOnly
                className={cn(
                  "h-[80px] w-full resize-none rounded-sm border-2 p-1",
                  scrollbar_style.scrollbar,
                )}
                defaultValue={product.note}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1" />
        <Button
          variant={"green"}
          onClick={(e) => onProductUpdateButtonClicked(row.index)}
          disabled={disableDeleteButton || disableDisableButton}
        >
          <PenLine size={16} fill="white" className="mr-2" />
          Update
        </Button>
        <Button
          variant={product.status === "Active" ? "red" : "green"}
          disabled={disableDeleteButton || disableDisableButton}
          onClick={(e) => {
            setDisableDisableButton(true);
            ProductService.updateProduct(
              {
                ...product,
                status: product.status === "Active" ? "Disabled" : "Active",
              },
              null,
            )
              .then((result) => {
                dispatch(updateProduct(result.data));
              })
              .catch((e) => axiosUIErrorHandler(e, toast))
              .finally(() => setDisableDisableButton(false));
          }}
        >
          <Lock size={16} className="mr-2" />
          {product.status === "Active" ? "Disable product" : "Activate product"}
          {disableDisableButton ? <LoadingCircle /> : null}
        </Button>
        <Button
          variant={"red"}
          onClick={(e) => {
            setDisableDeleteButton(true);
            ProductService.deleteProduct(product.id)
              .then((result) => {
                dispatch(deleteProduct(product.id));
                setShowTabs(false);
              })
              .catch((error) => axiosUIErrorHandler(error, toast))
              .finally(() => setDisableDeleteButton(false));
          }}
          disabled={disableDeleteButton || disableDisableButton}
        >
          <Trash size={16} className="mr-2" />
          Delete
          {disableDeleteButton ? <LoadingCircle /> : null}
        </Button>
      </div>
    </>
  );
};
