"use client";
import { useState } from "react";
import {
  purchaseOrderColumnTitles,
  purchaseOrderDetailColumnTitles,
  purchaseOrderColumns,
  purchaseOrderDetailTableColumns,
} from "./table_columns";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  CustomDatatable,
  DefaultInformationCellDataTable,
} from "@/components/component/custom_datatable";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import scrollbar_style from "@/styles/scrollbar.module.css";
import { Button } from "@/components/ui/button";
import { PenLine, Trash } from "lucide-react";
import LoadingCircle from "@/components/ui/loading_circle";
import StockCheckService from "@/services/stockCheckService";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { defaultColumn } from "@/components/ui/my_table_default_column";
import { PurchaseOrder, PurchaseOrderDetail } from "@/entities/PurchaseOrder";
import PurchaseOrderService from "@/services/purchaseOrderService";
import { deletePurchaseOrder } from "@/reducers/purchaseOrdersReducer";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const visibilityState = {
  creatorId: false,
  createdDate: false,
};

export function PurchaseOrderDatatable({ data }: { data: PurchaseOrder[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  async function deletePurchaseOrders(
    dataToDelete: PurchaseOrder[],
  ): Promise<void> {
    const promises = dataToDelete.map((purchaseOrder) => {
      return PurchaseOrderService.deletePurchaseOrder(purchaseOrder.id).then(
        (_) => dispatch(deletePurchaseOrder(purchaseOrder.id)),
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
          } purchase orders, failed ${
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
      columns={purchaseOrderColumns()}
      columnTitles={purchaseOrderColumnTitles}
      infoTabs={[
        {
          render: (row, setShowTabs) => {
            return (
              <DetailTab
                row={row}
                onUpdateButtonClick={() => {}}
                setShowInfoRow={setShowTabs}
              />
            );
          },
          tabName: "Detail",
        },
      ]}
      config={{
        defaultVisibilityState: visibilityState,
        onDeleteRowsBtnClick: deletePurchaseOrders,
      }}
    />
  );
}

const DetailTab = ({
  row,
  onUpdateButtonClick,
  setShowInfoRow,
}: {
  row: Row<PurchaseOrder>;
  onUpdateButtonClick: (discountPosition: number) => any;
  setShowInfoRow: (value: boolean) => any;
}) => {
  const purchaseOrder: PurchaseOrder = row.original;
  const [disableDisableButton, setDisableDisableButton] = useState(false);
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();

  return (
    <div className="p-2">
      <div className="flex flex-row gap-4">
        <div className="flex flex-1 flex-row text-[0.8rem]">
          <div className="flex flex-1 flex-col gap-2 pr-4">
            <DefaultInformationCellDataTable
              title="Purchase Order Id:"
              value={purchaseOrder.id}
            />
            <DefaultInformationCellDataTable
              title="Created Date:"
              value={format(new Date(purchaseOrder.createdDate), "MM/dd/yyyy")}
            />
            <DefaultInformationCellDataTable
              title="Creator:"
              value={purchaseOrder.staffId}
              // TODO:
            />
          </div>
          <div className="flex flex-1 flex-col">
            <p className="mb-2">Note</p>
            <textarea
              readOnly
              className={cn(
                "h-[80px] w-full resize-none rounded-sm border-2 p-1",
                scrollbar_style.scrollbar,
              )}
              defaultValue={purchaseOrder.note}
            ></textarea>
          </div>
        </div>
      </div>
      <CustomDatatable
        data={purchaseOrder.purchaseOrderDetail}
        columnTitles={purchaseOrderDetailColumnTitles}
        columns={purchaseOrderDetailTableColumns()}
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
            <p className="w-48 text-end">Total qty:</p>
            <p className="w-32 text-end font-semibold">
              {purchaseOrder.purchaseOrderDetail
                .map((v) => v.quantity)
                .reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-48 text-end">Total product:</p>
            <p className="w-32 text-end font-semibold">
              {purchaseOrder.purchaseOrderDetail.length}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-48 text-end">Sub-total:</p>
            <p className="w-32 text-end font-semibold">
              {purchaseOrder.subtotal}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-48 text-end">Discount:</p>
            <p className="w-32 text-end font-semibold">
              {purchaseOrder.discount}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-48 text-end">Total Discount:</p>
            <p className="w-32 text-end font-semibold">
              {purchaseOrder.discount +
                purchaseOrder.purchaseOrderDetail
                  .map((v) => v.discount)
                  .reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-48 text-end">Total:</p>
            <p className="w-32 text-end font-semibold">{purchaseOrder.total}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1" />
        {/* <Button
          variant={"green"}
          disabled={disableDeleteButton || disableDisableButton}
          onClick={() => onUpdateButtonClick(row.index)}
        >
          <PenLine size={16} fill="white" className="mr-2" />
          Update
        </Button> */}
        <Button
          variant={"red"}
          onClick={(e) => {
            setDisableDeleteButton(true);
            PurchaseOrderService.deletePurchaseOrder(purchaseOrder.id)
              .then((result) => {
                dispatch(deletePurchaseOrder(purchaseOrder.id));
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
    </div>
  );
};

const stockCheckDetailTitles = {
  productId: "Product ID",
  productName: "Name",
  unitName: "Unit",
  countedStock: "Counted",
  realStock: "In Stock",
  diffQuantity: "Diff Qty",
  diffCost: "Diff Cost",
};

const stockCheckDetailColumns = () => {
  const columns: ColumnDef<PurchaseOrderDetail>[] = [];
  for (const key in stockCheckDetailTitles)
    columns.push(defaultColumn(key, stockCheckDetailTitles));
  return columns;
};
