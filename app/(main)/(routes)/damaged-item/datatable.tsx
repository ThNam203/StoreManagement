"use client";
import {
  CustomDatatable,
  DefaultInformationCellDataTable,
} from "@/components/component/custom_datatable";
import { Button } from "@/components/ui/button";
import LoadingCircle from "@/components/ui/loading_circle";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import scrollbar_style from "@/styles/scrollbar.module.css";
import { Row } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { useState } from "react";
import { DamagedItemDocument } from "@/entities/DamagedItemDocument";
import DamagedItemService from "@/services/damagedItemService";
import { deleteDamagedItemDocument } from "@/reducers/damagedItemsReducer";
import {
  damagedItemDocumentColumnTitles,
  damagedItemDocumentColumnVisibilityState,
  damagedItemDocumentColumns,
  damagedItemDocumentDetailColumnTitles,
  damagedItemDocumentDetailTableColumns,
} from "./table_columns";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export function DamagedItemsDatatable({
  data,
}: {
  data: DamagedItemDocument[];
}) {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  async function deleteDamagedItemDocuments(
    dataToDelete: DamagedItemDocument[],
  ): Promise<void> {
    const promises = dataToDelete.map((damagedItemDocument) => {
      return DamagedItemService.deleteDamagedItemDocument(
        damagedItemDocument.id,
      ).then((_) =>
        dispatch(deleteDamagedItemDocument(damagedItemDocument.id)),
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
          } documents, failed ${
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
      columns={damagedItemDocumentColumns()}
      columnTitles={damagedItemDocumentColumnTitles}
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
        defaultVisibilityState: damagedItemDocumentColumnVisibilityState,
        onDeleteRowsBtnClick: deleteDamagedItemDocuments,
      }}
    />
  );
}

const DetailTab = ({
  row,
  onUpdateButtonClick,
  setShowInfoRow,
}: {
  row: Row<DamagedItemDocument>;
  onUpdateButtonClick: (discountPosition: number) => any;
  setShowInfoRow: (value: boolean) => any;
}) => {
  const document: DamagedItemDocument = row.original;
  const [disableDisableButton, setDisableDisableButton] = useState(false);
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const staffs = useAppSelector((state) => state.staffs.value);

  return (
    <>
      <div className="flex flex-row gap-4">
        <div className="flex flex-1 flex-row text-[0.8rem]">
          <div className="flex flex-1 flex-col gap-2 pr-4">
            <DefaultInformationCellDataTable
              title="Document Id:"
              value={document.id}
            />
            <DefaultInformationCellDataTable
              title="Created Date:"
              value={format(new Date(document.createdDate), "MM/dd/yyyy")}
            />
            <DefaultInformationCellDataTable
              title="Creator:"
              value={
                staffs.find((v) => v.id === document.creatorId)?.name ??
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
              defaultValue={document.note}
            ></textarea>
          </div>
        </div>
      </div>
      <CustomDatatable
        data={document.products}
        columnTitles={damagedItemDocumentDetailColumnTitles}
        columns={damagedItemDocumentDetailTableColumns()}
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
            <p className="w-48 text-end">Total quantity:</p>
            <p className="w-32 text-end font-semibold">
              {document.products
                .map((v) => v.damagedQuantity)
                .reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-48 text-end">Total value:</p>
            <p className="w-32 text-end font-semibold">
              {document.products
                .map((v) => v.costPrice * v.damagedQuantity)
                .reduce((a, b) => a + b, 0)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1" />
        <Button
          variant={"red"}
          onClick={(e) => {
            setDisableDeleteButton(true);
            DamagedItemService.deleteDamagedItemDocument(document.id)
              .then((result) => {
                dispatch(deleteDamagedItemDocument(document.id));
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
