/* eslint-disable @next/next/no-img-element */
"use client";
import { CustomDatatable, DefaultInformationCellDataTable } from "@/components/component/custom_datatable";
import { Button } from "@/components/ui/button";
import LoadingCircle from "@/components/ui/loading_circle";
import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import { defaultColumn } from "@/components/ui/my_table_default_column";
import { useToast } from "@/components/ui/use-toast";
import { Invoice, InvoiceDetail } from "@/entities/Invoice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { deleteInvoice } from "@/reducers/invoicesReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import InvoiceService from "@/services/invoiceService";
import scrollbar_style from "@/styles/scrollbar.module.css";
import {
  ColumnDef,
  Row
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Undo2 } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { useState } from "react";
import {
  invoiceColumnTitles,
  invoiceDefaultVisibilityState,
  invoiceTableColumns,
} from "./table_columns";
import { formatPrice } from "@/utils";

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
      axiosUIErrorHandler(e, toast, router);
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
  const staffs = useAppSelector((state) => state.staffs.value);
  const customers = useAppSelector((state) => state.customers.value);
  const roles = useAppSelector((state) => state.role.value);
  const profile = useAppSelector((state) => state.profile.value)!;
  const userPermissions = roles?.find(
    (role) => role.positionName === profile?.position,
  )!.roleSetting;

  return (
    <div className="p-2">
      <div className="flex flex-row gap-2">
        <div className="flex flex-1 flex-row text-[0.8rem] gap-4">
          <div className="flex flex-1 flex-col gap-1">
            <DefaultInformationCellDataTable
              title="Invoice id:"
              value={invoice.id}
            />
            <DefaultInformationCellDataTable
              title="Created at:"
              value={format(new Date(invoice.createdAt), "MM/dd/yyyy")}
            />
            <DefaultInformationCellDataTable
              title="Customer:"
              value={customers.find((v) => v.id === invoice.customerId)?.name ?? ""}
            />
            <DefaultInformationCellDataTable
              title="Staff:"
              value={staffs.find((v) => v.id === invoice.staffId)?.name ?? "Not found"}
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
        {userPermissions.returnInvoice.create && <Button
          variant={"green"}
          onClick={(e) => {
            router.push(`/invoice-return?invoiceId=${invoice.id}`);
          }}
          disabled={disableDeleteButton}
        >
          <Undo2 size={16} className="mr-2" />
            Return
          {disableDeleteButton ? <LoadingCircle /> : null}
        </Button>}
        {/* <Button
          variant={"red"}
          onClick={(e) => {
            setDisableDeleteButton(true);
            InvoiceService.deleteInvoice(invoice.id)
              .then((result) => {
                dispatch(deleteInvoice(invoice.id));
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
        </Button> */}
      </div>
    </div>
  );
};

const invoiceDetailTitles = {
  quantity: "Quantity",
  price: "Price",
  description: "Description",
};

const invoiceDetailColumns = () => {
  const columns: ColumnDef<InvoiceDetail>[] = [productIdToProductNameColumn];
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
        {formatPrice(detail.price * detail.quantity)}
      </p>
    );
  },
};

const productIdToProductNameColumn: ColumnDef<InvoiceDetail> = {
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
