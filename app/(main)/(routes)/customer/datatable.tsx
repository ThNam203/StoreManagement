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
  customerColumnTitles,
  customerDefaultVisibilityState,
  customerTableColumns,
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
import ProductService from "@/services/product_service";
import LoadingCircle from "@/components/ui/loading_circle";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useToast } from "@/components/ui/use-toast";
import { CustomDatatable } from "@/components/component/custom_datatable";
import InvoiceService from "@/services/invoice_service";
import { format } from "date-fns";
import { defaultColumn } from "@/components/ui/my_table_default_column";
import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { deleteInvoice } from "@/reducers/invoicesReducer";
import { Customer } from "@/entities/Customer";
import CustomerService from "@/services/customer_service";

export function CustomerDatatable({ data }: { data: Customer[] }) {
  const { toast } = useToast();

  async function deleteCustomers(dataToDelete: Customer[]): Promise<void> {
    const promises = dataToDelete.map((customer) => {
      return CustomerService.deleteCustomer(customer.id);
    });

    try {
      Promise.allSettled(promises).then((deletedData) => {
        const successfullyDeleted = deletedData.map(
          (data) => data.status === "fulfilled",
        );
        toast({
          description: `Deleted ${
            successfullyDeleted.length
          } customers, failed ${
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
      columns={customerTableColumns()}
      columnTitles={customerColumnTitles}
      infoTabs={[
        {
          render(row, setShowTabs) {
            return <DetailCustomerTab row={row} setShowTabs={setShowTabs} />;
          },
          tabName: "Detail",
        },
      ]}
      config={{
        onDeleteRowsBtnClick: (dataToDelete) => deleteCustomers(dataToDelete), // if null, remove button
        defaultVisibilityState: customerDefaultVisibilityState,
      }}
    />
  );
}

const DetailCustomerTab = ({
  row,
  setShowTabs,
}: {
  row: Row<Customer>;
  setShowTabs: (value: boolean) => any;
}) => {
  const customer = row.original;
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  return (
    <div className="py-2">
      <div className="flex flex-row gap-2">
        <div className="w-[300px] bg-contain bg-center">
          <img src={customer.image.url ?? "/default-user-avatar.png"} />
        </div>
        <div className="flex flex-1 flex-row text-[0.8rem]">
          <div className="flex flex-1 flex-col gap-1 pr-4">
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Customer id:</p>
              <p>{customer.id}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Customer name:</p>
              <p>{customer.name}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Date of birth:</p>
              {customer.birthday}
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Email:</p>
              {customer.email}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1 pr-4">
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Customer group:</p>
              <p>{customer.customerGroup}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Phone number</p>
              <p>{customer.phoneNumber}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Address</p>
              <p>{customer.address}</p>
            </div>
            {/* TODO: CHANGE CREATORID -> NAME */}
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Creator Id</p>
              <p>{customer.creator}</p>
            </div>
            <div>
              <p className="mb-2">Note</p>
              <textarea
                readOnly
                className={cn(
                  "h-[80px] w-full resize-none rounded-sm border-2 p-1",
                  scrollbar_style.scrollbar,
                )}
                defaultValue={customer.description}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1" />
        <Button
          variant={"red"}
          onClick={(e) => {
            setDisableDeleteButton(true);
            InvoiceService.deleteInvoice(customer.id)
              .then((result) => {
                dispatch(deleteInvoice(customer.id));
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
