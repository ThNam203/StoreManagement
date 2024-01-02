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
} from "@tanstack/react-table";
import { columnTitles, discountTableColumns } from "./table_columns";
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
import { ChevronRight, Code, Lock, PenLine, Trash } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { deleteProduct, updateProduct } from "@/reducers/productsReducer";
import ProductService from "@/services/productService";
import LoadingCircle from "@/components/ui/loading_circle";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import { useToast } from "@/components/ui/use-toast";
import { Discount, DiscountCode } from "@/entities/Discount";
import DiscountService from "@/services/discountService";
import { deleteDiscount, updateDiscount } from "@/reducers/discountsReducer";
import {
  defaultColumn,
  defaultSelectColumn,
} from "@/components/ui/my_table_default_column";
import AddNewThing from "@/components/ui/add_new_thing_dialog";
import { useDispatch } from "react-redux";
import { CustomDatatable } from "@/components/component/custom_datatable";
import { useRouter } from "next/navigation";

type Props = {
  data: Discount[];
  onUpdateButtonClick: (discountPosition: number) => any;
};

const visibilityConfig = {
  id: true,
  name: true,
  description: false,
  status: true,
  value: true,
  amount: false,
  startDate: false,
  endDate: false,
  createdAt: false,
  maxValue: true,
  minSubTotal: true,
};

export function DiscountDatatable({ data, onUpdateButtonClick }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();

  async function deleteDiscounts(dataToDelete: Discount[]): Promise<void> {
    const promises = dataToDelete.map((discount) => {
      return DiscountService.deleteDiscount(discount.id).then((_) =>
        dispatch(deleteDiscount(discount.id)),
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
          } discounts, failed ${
            deletedData.length - successfullyDeleted.length
          }`,
        });
        return Promise.resolve();
      });
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  }

  return (
    <CustomDatatable
      data={data}
      columns={discountTableColumns()}
      columnTitles={columnTitles}
      infoTabs={[
        {
          render: (row, setShowTabs) => (
            <DetailTab
              row={row}
              setShowInfoRow={setShowTabs}
              onUpdateButtonClick={onUpdateButtonClick}
            />
          ),
          tabName: "Detail",
        },
        {
          render: (row, setShowTabs) => <CodeEditTab discount={row.original} />,
          tabName: "Codes",
        },
      ]}
      config={{
        defaultVisibilityState: visibilityConfig,
        onDeleteRowsBtnClick: deleteDiscounts,
      }}
    />
  );
}

const DetailTab = ({
  row,
  onUpdateButtonClick,
  setShowInfoRow,
}: {
  row: any;
  onUpdateButtonClick: (discountPosition: number) => any;
  setShowInfoRow: (value: boolean) => any;
}) => {
  const products = useAppSelector((state) => state.products.value);
  const discount: Discount = row.original;
  const [disableDisableButton, setDisableDisableButton] = useState(false);
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();

  return (
    <>
      <h4 className="text-lg font-bold text-blue-800">{discount.name}</h4>
      <div className="flex flex-row gap-4">
        <div className="flex flex-1 flex-row text-[0.8rem]">
          <div className="flex flex-1 flex-col pr-4">
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Discount id:</p>
              <p>{discount.id}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Value:</p>
              {discount.value}
              {discount.type === "COUPON" ? " %" : null}
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Type:</p>
              {discount.type}
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Amount:</p>
              <p>{discount.amount}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Status:</p>
              <p>{discount.status ? "Activating" : "Disabled"}</p>
            </div>
            <div className="flex flex-1 flex-col pr-4">
              <p className="mb-2">Description</p>
              <textarea
                readOnly
                className={cn(
                  "h-[80px] w-full resize-none rounded-sm border-2 p-1",
                  scrollbar_style.scrollbar,
                )}
                defaultValue={discount.description}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="mb-2 flex flex-row border-b font-medium">
            <p className="w-[100px] min-w-[100px] font-normal">P.Groups:</p>
            <div
              className={cn(
                "flex max-h-[100px] flex-row flex-wrap overflow-y-auto",
                scrollbar_style.scrollbar,
              )}
            >
              {discount.productGroups?.map((group, groupIdx) => (
                <p
                  key={groupIdx}
                  className="mb-1 mr-1 rounded-md bg-blue-400 p-1 text-xs text-white"
                >
                  {group}
                </p>
              ))}
            </div>
          </div>
          <div className="mb-2 flex flex-row border-b font-medium">
            <p className="w-[100px] min-w-[100px] font-normal">Products:</p>
            <div
              className={cn(
                "flex max-h-[100px] flex-row flex-wrap overflow-y-auto",
                scrollbar_style.scrollbar,
              )}
            >
              {discount.productIds?.map((productId, productIdx) => {
                const product = products.find(
                  (product) => product.id === productId,
                )!;
                return (
                  <p
                    key={productIdx}
                    className="mb-1 mr-1 rounded-md bg-blue-400 p-1 text-xs text-white"
                  >
                    {product.name}
                    {product.propertiesString
                      ? ` (${product.propertiesString})`
                      : ""}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1" />
        <Button
          variant={"green"}
          disabled={disableDeleteButton || disableDisableButton}
          onClick={() => onUpdateButtonClick(row.index)}
        >
          <PenLine size={16} fill="white" className="mr-2" />
          Update
        </Button>
        <Button
          variant={discount.status ? "red" : "green"}
          disabled={disableDeleteButton || disableDisableButton}
          onClick={(e) => {
            setDisableDisableButton(true);
            DiscountService.updateDiscount({
              ...discount,
              status: !discount.status,
            })
              .then((result) => {
                dispatch(updateDiscount(result.data));
              })
              .catch((e) => axiosUIErrorHandler(e, toast, router))
              .finally(() => setDisableDisableButton(false));
          }}
        >
          <Lock size={16} className="mr-2" />
          {discount.status ? "Disable discount" : "Activate discount"}
          {disableDisableButton ? <LoadingCircle /> : null}
        </Button>
        <Button
          variant={"red"}
          onClick={(e) => {
            setDisableDeleteButton(true);
            DiscountService.deleteDiscount(discount.id)
              .then((result) => {
                dispatch(deleteDiscount(discount.id));
                setShowInfoRow(false);
              })
              .catch((error) => axiosUIErrorHandler(error, toast, router))
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

const codeTabColumns = (): ColumnDef<DiscountCode>[] => {
  const columnTitles = {
    value: "Code",
    issuedDate: "Issued Date",
    usedDate: "Used Date",
  };
  const cols: ColumnDef<DiscountCode>[] = [defaultSelectColumn<DiscountCode>()];
  for (const key in columnTitles) {
    // if (key === columnTitles.status)
    cols.push(defaultColumn<DiscountCode>(key, columnTitles));
  }

  return cols;
};

const CodeEditTab = ({ discount }: { discount: Discount }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const columns = codeTabColumns();

  const table = useReactTable<DiscountCode>({
    data: discount.discountCodes ? discount.discountCodes : [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);
  const [isDeletingCodes, setIsDeletingCodes] = useState(false);
  const [codeAmountInput, setCodeAmountInput] = useState(0);
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div className="w-full">
      <div className="flex flex-row items-center gap-2 py-4">
        <Input
          placeholder="Find code"
          value={(table.getColumn("value")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("value")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {table.getSelectedRowModel().rows.length > 0 ? (
          <Button
            variant={"red"}
            disabled={isDeletingCodes}
            onClick={() => {
              setIsDeletingCodes(true);
              const codeIds = table
                .getSelectedRowModel()
                .rows.map((code) => code.original.id);

              DiscountService.deleteDiscountCodes(discount.id, codeIds)
                .then((result) => {
                  dispatch(
                    updateDiscount({
                      ...discount,
                      discountCodes: discount.discountCodes!.filter(
                        (code) => !codeIds.includes(code.id),
                      ),
                    }),
                  );
                  table.toggleAllRowsSelected(false);
                })
                .catch((e) => axiosUIErrorHandler(e, toast, router))
                .finally(() => {
                  setIsDeletingCodes(false);
                });
            }}
          >
            Delete{isDeletingCodes ? <LoadingCircle /> : null}
          </Button>
        ) : null}
        <div className="flex-1" />
        <div className="flex flex-row gap-2">
          <input
            type="number"
            className="w-[50px] rounded-md border px-1 text-end"
            min={0}
            value={codeAmountInput}
            onChange={(e) => setCodeAmountInput(e.currentTarget.valueAsNumber)}
          />
          <Button
            variant={"green"}
            disabled={isGeneratingCodes}
            onClick={(e) => {
              if (isNaN(codeAmountInput)) return;
              if (
                (discount.discountCodes?.length ?? 0) + codeAmountInput >
                discount.amount
              )
                return toast({
                  variant: "destructive",
                  description:
                    "The amount of discount codes exceeds the allowed limit",
                });

              setIsGeneratingCodes(true);
              DiscountService.generateDiscountCodes(
                discount.id,
                codeAmountInput,
              )
                .then((result) => {
                  dispatch(
                    updateDiscount({
                      ...discount,
                      discountCodes: [
                        ...result.data,
                        ...(discount.discountCodes
                          ? discount.discountCodes
                          : []),
                      ],
                    }),
                  );
                })
                .catch((e) => axiosUIErrorHandler(e, toast, router))
                .finally(() => {
                  setIsGeneratingCodes(false);
                });
            }}
          >
            Generate{isGeneratingCodes ? <LoadingCircle /> : null}
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
