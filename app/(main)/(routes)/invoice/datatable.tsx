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
  invoiceColumnTitles,
  invoiceDefaultVisibilityState,
  invoiceTableColumns,
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
import { ChevronRight, Lock, PenLine, Trash, Undo2 } from "lucide-react";
import { useAppDispatch } from "@/hooks";
import { deleteProduct, updateProduct } from "@/reducers/productsReducer";
import ProductService from "@/services/productService";
import LoadingCircle from "@/components/ui/loading_circle";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useToast } from "@/components/ui/use-toast";
import { CustomDatatable } from "@/components/component/custom_datatable";
import { Invoice, InvoiceDetail } from "@/entities/Invoice";
import InvoiceService from "@/services/invoiceService";
import { format } from "date-fns";
import { defaultColumn } from "@/components/ui/my_table_default_column";
import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { deleteInvoice } from "@/reducers/invoicesReducer";

export function InvoiceDatatable({
  data,
  router,
}: {
  data: Invoice[];
  router: AppRouterInstance;
}) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  async function deleteInvoices(dataToDelete: Invoice[]): Promise<void> {
    const promises = dataToDelete.map(async (invoice) => {
      await InvoiceService.deleteInvoice(invoice.id);
      return dispatch(deleteInvoice(invoice.id));
    });

    try {
      Promise.allSettled(promises).then((deletedData) => {
        const successfullyDeleted = deletedData.map(
          (data) => data.status === "fulfilled",
        );
        toast({
          description: `Deleted ${
            successfullyDeleted.length
          } invoices, failed ${
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
      columns={invoiceTableColumns()}
      columnTitles={invoiceColumnTitles}
      infoTabs={[
        {
          render(row, setShowTabs) {
            return (
              <DetailInvoiceTab
                row={row}
                setShowTabs={setShowTabs}
                router={router}
              />
            );
          },
          tabName: "Detail",
        },
      ]}
      config={{
        onDeleteRowsBtnClick: (dataToDelete) => deleteInvoices(dataToDelete), // if null, remove button
        defaultVisibilityState: invoiceDefaultVisibilityState,
      }}
    />
  );
}

const DetailInvoiceTab = ({
  row,
  setShowTabs,
  router,
}: {
  row: Row<Invoice>;
  setShowTabs: (value: boolean) => any;
  router: AppRouterInstance;
}) => {
  const invoice = row.original;
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  return (
    <div className="py-2">
      <div className="flex flex-row gap-2">
        <div className="flex flex-1 flex-row text-[0.8rem]">
          <div className="flex flex-1 flex-col gap-1 pr-4">
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Invoice id:</p>
              <p>{invoice.id}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Created at:</p>
              <p>{invoice.createdAt}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Customer:</p>
              {invoice.customerId}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1 pr-4">
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Staff id:</p>
              <p>{invoice.staffId}</p>
            </div>
            <div>
              <p className="mb-2">Note</p>
              <textarea
                readOnly
                className={cn(
                  "h-[80px] w-full resize-none rounded-sm border-2 p-1",
                  scrollbar_style.scrollbar,
                )}
                defaultValue={invoice.note}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <CustomDatatable
        data={invoice.invoiceDetails}
        columnTitles={invoiceDetailTitles}
        columns={invoiceDetailColumns()}
        config={{
          showDataTableViewOptions: false,
          showDefaultSearchInput: false,
          className: "py-0",
          showRowSelectedCounter: false,
        }}
      ></CustomDatatable>
      <div className="flex flex-row justify-between">
        <div className="flex-1"></div>
        <div className="mb-2 flex flex-col gap-1 text-xs">
          <div className="flex flex-row">
            <p className="w-28 text-end">Total qty:</p>
            <p className="w-32 text-end font-semibold">
              {invoice.invoiceDetails
                .map((v) => v.quantity)
                .reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-28 text-end">Sub total:</p>
            <p className="w-32 text-end font-semibold">{invoice.subTotal}</p>
          </div>
          <div className="flex flex-row">
            <p className="w-28 text-end">Discount:</p>
            <p className="w-32 text-end font-semibold">
              {invoice.discountValue}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-28 text-end">Total:</p>
            <p className="w-32 text-end font-semibold">{invoice.total}</p>
          </div>
          <div className="flex flex-row">
            <p className="w-28 text-end">Paid:</p>
            <p className="w-32 text-end font-semibold">{invoice.cash}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1" />
        <Button
          variant={"green"}
          onClick={(e) => {
            router.push(`/invoice-return?invoiceId${invoice.id}`);
          }}
          disabled={disableDeleteButton}
        >
          <Undo2 size={16} className="mr-2" />
          Return
          {disableDeleteButton ? <LoadingCircle /> : null}
        </Button>
        <Button
          variant={"red"}
          onClick={(e) => {
            setDisableDeleteButton(true);
            InvoiceService.deleteInvoice(invoice.id)
              .then((result) => {
                dispatch(deleteInvoice(invoice.id));
                setShowTabs(false);
              })
              .catch((error) => axiosUIErrorHandler(error, toast))
              .finally(() => setDisableDeleteButton(false));
          }}
          disabled={disableDeleteButton}
        >
          <Trash size={16} className="mr-2" />
          Delete
          {disableDeleteButton ? <LoadingCircle /> : null}
        </Button>
      </div>
    </div>
  );
};

const invoiceDetailTitles = {
  productId: "Product ID",
  quantity: "Quantity",
  price: "Price",
  description: "Description",
};

const invoiceDetailColumns = () => {
  const columns: ColumnDef<InvoiceDetail>[] = [];
  for (const key in invoiceDetailTitles) {
    columns.push(defaultColumn(key, invoiceDetailTitles));
  }
  columns.push(invoiceDetailTotalColumn);
  return columns;
};

const invoiceDetailTotalColumn: ColumnDef<InvoiceDetail> = {
  accessorKey: "total",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Total" />
  ),
  cell: ({ row }) => {
    const detail = row.original;
    return (
      <p className="text-[0.8rem] font-semibold">
        {detail.price * detail.quantity}
      </p>
    );
  },
};
