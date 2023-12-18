"use client";
import { useState } from "react";
import {
  stockCheckColumnTitles,
  stockCheckTableColumns,
} from "./table_columns";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { CustomDatatable } from "@/components/component/custom_datatable";
import { StockCheck } from "@/entities/StockCheck";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import scrollbar_style from "@/styles/scrollbar.module.css";
import { Button } from "@/components/ui/button";
import { PenLine, Trash } from "lucide-react";
import LoadingCircle from "@/components/ui/loading_circle";
import StockCheckService from "@/services/stock_check_service";
import { deleteStockCheck } from "@/reducers/stockChecksReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";

const visibilityState = {
  creatorId: false,
  createdDate: false,
};

export function StockCheckDatatable({data}:{data: StockCheck[]}) {
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
  const [disableDisableButton, setDisableDisableButton] = useState(false);
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  return (
    <>
      <div className="flex flex-row gap-4">
        <div className="flex flex-row flex-1 text-[0.8rem]">
          <div className="flex-1 flex flex-col pr-4">
            <div className="flex flex-row font-medium border-b mb-2">
              <p className="w-[100px] font-normal">Check Id:</p>
              <p>{stockCheck.id}</p>
            </div>
            <div className="flex flex-row font-medium border-b mb-2">
              <p className="w-[100px] font-normal">Created At:</p>
              {stockCheck.createdDate}
            </div>
            <div className="flex flex-row font-medium border-b mb-2">
              <p className="w-[100px] font-normal">Creator Id:</p>
              {stockCheck.creatorId}
              {/* FIXXX */}
            </div>
          </div>
          <div className="flex-1 flex flex-col pr-4">
            <p className="mb-2">Note</p>
            <textarea
              readOnly
              className={cn(
                "resize-none border-2 rounded-sm p-1 h-[80px] w-full",
                scrollbar_style.scrollbar
              )}
              defaultValue={stockCheck.note}
            ></textarea>
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
