/* eslint-disable @next/next/no-img-element */
"use client";
import {
  CustomDatatable,
  DefaultInformationCellDataTable,
} from "@/components/component/custom_datatable";
import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import { defaultColumn } from "@/components/ui/my_table_default_column";
import { useToast } from "@/components/ui/use-toast";
import {
  ReturnInvoiceDetailServer,
  ReturnInvoiceServer
} from "@/entities/ReturnInvoice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { deleteReturnInvoice } from "@/reducers/returnInvoicesReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import ReturnInvoiceService from "@/services/returnInvoiceService";
import scrollbar_style from "@/styles/scrollbar.module.css";
import {
  ColumnDef,
  Row
} from "@tanstack/react-table";
import { format } from "date-fns";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { useState } from "react";
import {
  returnColumnTitles,
  returnDefaultVisibilityState,
  returnTableColumns,
} from "./table_columns";

export function ReturnDatatable({
  data,
  router,
}: {
  data: ReturnInvoiceServer[];
  router: AppRouterInstance;
}) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  async function deleteReturns(
    dataToDelete: ReturnInvoiceServer[],
  ): Promise<void> {
    const promises = dataToDelete.map(async (returnInvoice) => {
      await ReturnInvoiceService.deleteReturnInvoice(returnInvoice.id);
      return dispatch(deleteReturnInvoice(returnInvoice.id));
    });

    try {
      Promise.allSettled(promises).then((deletedData) => {
        const successfullyDeleted = deletedData.map(
          (data) => data.status === "fulfilled",
        );
        toast({
          description: `Deleted ${
            successfullyDeleted.length
          } return invoices, failed ${
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
      columns={returnTableColumns()}
      columnTitles={returnColumnTitles}
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
        onDeleteRowsBtnClick: (dataToDelete) => deleteReturns(dataToDelete), // if null, remove button
        defaultVisibilityState: returnDefaultVisibilityState,
      }}
    />
  );
}

const DetailInvoiceTab = ({
  row,
  setShowTabs,
  router,
}: {
  row: Row<ReturnInvoiceServer>;
  setShowTabs: (value: boolean) => any;
  router: AppRouterInstance;
}) => {
  const invoice = row.original;
  const staffs = useAppSelector((state) => state.staffs.value);

  return (
    <div className="p-2">
      <div className="flex flex-row gap-2">
        <div className="flex flex-1 flex-row text-[0.8rem] gap-4">
          <div className="flex flex-1 flex-col gap-1">
          <DefaultInformationCellDataTable
              title="Return Invoice id:"
              value={invoice.id}
            />
            <DefaultInformationCellDataTable
              title="Invoice id:"
              value={invoice.invoiceId}
            />
            <DefaultInformationCellDataTable
              title="Created at:"
              value={format(new Date(invoice.createdAt), "MM/dd/yyyy")}
            />
            <DefaultInformationCellDataTable
              title="Staff:"
              value={
                staffs.find((s) => s.id === invoice.staffId)?.name ??
                "Not found"
              }
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
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
        data={invoice.returnDetails}
        columnTitles={returnDetailTitles}
        columns={returnDetailColumns()}
        config={{
          showDataTableViewOptions: false,
          showDefaultSearchInput: false,
          className: "py-0",
          showRowSelectedCounter: false,
        }}
      />
      <div className="flex flex-row justify-between">
        <div className="flex-1"></div>
        <div className="mb-2 flex flex-col gap-1 text-xs">
          <div className="flex flex-row">
            <p className="w-28 text-end">Total qty:</p>
            <p className="w-32 text-end font-semibold">
              {invoice.returnDetails
                .map((v) => v.quantity)
                .reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-28 text-end">Sub total &#40;Refund&#41;:</p>
            <p className="w-32 text-end font-semibold">
              {invoice.returnDetails
                .map((v) => v.quantity * v.price)
                .reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-28 text-end">Discount:</p>
            <p className="w-32 text-end font-semibold">
              {invoice.discountValue}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-28 text-end">Return fee:</p>
            <p className="w-32 text-end font-semibold">{invoice.returnFee}</p>
          </div>
          <div className="flex flex-row">
            <p className="w-28 text-end">Total &#40;Refund&#41;:</p>
            <p className="w-32 text-end font-semibold">{invoice.total}</p>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-row items-center gap-2">
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
            ReturnInvoiceService.deleteReturnInvoice(invoice.id)
              .then((result) => {
                dispatch(deleteReturnInvoice(invoice.id));
                setShowTabs(false);
              })
              .catch((error) => axiosUIErrorHandler(error, toast, router))
              .finally(() => setDisableDeleteButton(false));
          }}
          disabled={disableDeleteButton}
        >
          <Trash size={16} className="mr-2" />
          Delete
          {disableDeleteButton ? <LoadingCircle /> : null}
        </Button>
      </div> */}
    </div>
  );
};

const returnDetailTitles = {
  quantity: "Quantity",
  price: "Price",
  description: "Description",
};

const returnDetailColumns = () => {
  const columns: ColumnDef<ReturnInvoiceDetailServer>[] = [productIdToProductNameColumn];
  for (const key in returnDetailTitles) {
    columns.push(defaultColumn(key, returnDetailTitles));
  }
  columns.push(returnDetailTotalColumn);
  return columns;
};

const returnDetailTotalColumn: ColumnDef<ReturnInvoiceDetailServer> = {
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

const productIdToProductNameColumn: ColumnDef<ReturnInvoiceDetailServer> = {
  accessorKey: "productId",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Product" />
  ),
  cell: ({ row }) => {
    const detail = row.original;
    return ProductNameCell(detail.productId)
  },
};

const ProductNameCell = (productId: number) => {
  const products = useAppSelector((state) => state.products.value);
  const product = products.find((v) => v.id === productId)!
  return <p className={cn("text-[0.8rem]", product.isDeleted ? "text-red-500" : "")}>{product.name}</p>;
}
