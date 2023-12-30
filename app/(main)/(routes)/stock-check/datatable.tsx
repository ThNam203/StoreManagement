"use client";
import { useState } from "react";
import {
  stockCheckColumnTitles,
  stockCheckTableColumns,
} from "./table_columns";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  CustomDatatable,
  DefaultInformationCellDataTable,
} from "@/components/component/custom_datatable";
import { StockCheck, StockCheckDetail } from "@/entities/StockCheck";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import scrollbar_style from "@/styles/scrollbar.module.css";
import { Button } from "@/components/ui/button";
import { PenLine, Trash } from "lucide-react";
import LoadingCircle from "@/components/ui/loading_circle";
import StockCheckService from "@/services/stockCheckService";
import { deleteStockCheck } from "@/reducers/stockChecksReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import { ColumnDef } from "@tanstack/react-table";
import { defaultColumn } from "@/components/ui/my_table_default_column";

const visibilityState = {
  creatorId: false,
  createdDate: false,
};

export function StockCheckDatatable({ data }: { data: StockCheck[] }) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  async function deleteStockChecks(dataToDelete: StockCheck[]): Promise<void> {
    const promises = dataToDelete.map((stockCheck) => {
      return StockCheckService.deleteStockCheck(stockCheck.id).then((_) =>
        dispatch(deleteStockCheck(stockCheck.id)),
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
          } stock checks, failed ${
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
      columns={stockCheckTableColumns()}
      columnTitles={stockCheckColumnTitles}
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
        onDeleteRowsBtnClick: deleteStockChecks,
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
  const stockCheck: StockCheck = row.original;
  const staffs = useAppSelector((state) => state.staffs.value);
  const [disableDisableButton, setDisableDisableButton] = useState(false);
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  return (
    <>
      <div className="flex flex-row gap-4">
        <div className="flex flex-1 flex-row text-[0.8rem]">
          <div className="flex flex-1 flex-col gap-2 pr-4">
            <DefaultInformationCellDataTable
              title="Check Id:"
              value={stockCheck.id}
            />
            <DefaultInformationCellDataTable
              title="Created Date:"
              value={stockCheck.createdDate}
            />
            <DefaultInformationCellDataTable
              title="Creator:"
              value={
                staffs.find((v) => v.id === stockCheck.creatorId)?.name ??
                "NOT FOUND"
              }
            />
          </div>
          <div className="flex flex-1 flex-col pr-4">
            <p className="mb-2">Note</p>
            <textarea
              readOnly
              className={cn(
                "h-[80px] w-full resize-none rounded-sm border-2 p-1",
                scrollbar_style.scrollbar,
              )}
              defaultValue={stockCheck.note}
            ></textarea>
          </div>
        </div>
      </div>
      <CustomDatatable
        data={stockCheck.products}
        columnTitles={stockCheckDetailTitles}
        columns={stockCheckDetailColumns()}
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
            <p className="w-48 text-end">
              Total counted: &#40;
              {stockCheck.products
                .map((v) => v.countedStock)
                .reduce((a, b) => a + b, 0)}
              &#41;
            </p>
            <p className="w-32 text-end font-semibold">
              {stockCheck.products
                .map((v) => v.countedStock * v.price)
                .reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-48 text-end">
              Surplus qty: &#40;
              {stockCheck.products
                .map((v) => (v.diffQuantity > 0 ? v.diffQuantity : 0))
                .reduce((a, b) => a + b, 0)}
              &#41;
            </p>
            <p className="w-32 text-end font-semibold">
              {stockCheck.products
                .map((v) => v.price * (v.diffQuantity > 0 ? v.diffQuantity : 0))
                .reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-48 text-end">
              Missing qty: &#40;
              {stockCheck.products
                .map((v) => (v.diffQuantity < 0 ? v.diffQuantity : 0))
                .reduce((a, b) => a + b, 0)}
              &#41;
            </p>
            <p className="w-32 text-end font-semibold">
              {stockCheck.products
                .map((v) => v.price * (v.diffQuantity < 0 ? v.diffQuantity : 0))
                .reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-48 text-end">
              Total diff. quantity: &#40;
              {stockCheck.products
                .map((v) => v.diffQuantity)
                .reduce((a, b) => a + b, 0)}
              &#41;
            </p>
            <p className="w-32 text-end font-semibold">
              {stockCheck.products
                .map((v) => v.price * v.diffQuantity)
                .reduce((a, b) => a + b, 0)}
            </p>
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
          variant={"red"}
          onClick={(e) => {
            setDisableDeleteButton(true);
            StockCheckService.deleteStockCheck(stockCheck.id)
              .then((result) => {
                dispatch(deleteStockCheck(stockCheck.id));
                setShowInfoRow(false);
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

const stockCheckDetailTitles = {
  productId: "Product ID",
  productName: "Name",
  productProperties: "Properties",
  unitName: "Unit",
  countedStock: "Counted",
  realStock: "In Stock",
  diffQuantity: "Diff Qty",
  diffCost: "Diff Cost",
};

const stockCheckDetailColumns = () => {
  const columns: ColumnDef<StockCheckDetail>[] = [];
  for (const key in stockCheckDetailTitles)
    columns.push(defaultColumn(key, stockCheckDetailTitles));
  return columns;
};
