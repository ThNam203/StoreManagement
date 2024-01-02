/* eslint-disable @next/next/no-img-element */
"use client";
import {
  CustomDatatable,
  DefaultInformationCellDataTable,
} from "@/components/component/custom_datatable";
import UpdateSupplierDialog from "@/components/component/update_supplier_dialog";
import { Button } from "@/components/ui/button";
import LoadingCircle from "@/components/ui/loading_circle";
import { useToast } from "@/components/ui/use-toast";
import { Supplier } from "@/entities/Supplier";
import { useAppDispatch } from "@/hooks";
import { cn } from "@/lib/utils";
import { deleteSupplier } from "@/reducers/suppliersReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import SupplierService from "@/services/supplierService";
import scrollbar_style from "@/styles/scrollbar.module.css";
import {
  Row
} from "@tanstack/react-table";
import { PenLine, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  supplierColumnTitles,
  supplierDefaultVisibilityState,
  supplierTableColumns,
} from "./table_columns";

export function SupplierDatatable({ data }: { data: Supplier[] }) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function deleteSuppliers(dataToDelete: Supplier[]): Promise<void> {
    const promises = dataToDelete.map(async (supplier) => {
      await SupplierService.deleteSupplier(supplier.id);
      return dispatch(deleteSupplier(supplier.id));
    });

    try {
      Promise.allSettled(promises).then((deletedData) => {
        const successfullyDeleted = deletedData.map(
          (data) => data.status === "fulfilled",
        );
        toast({
          description: `Deleted ${
            successfullyDeleted.length
          } suppliers, failed ${
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
      columns={supplierTableColumns()}
      columnTitles={supplierColumnTitles}
      infoTabs={[
        {
          render(row, setShowTabs) {
            return <DetailSupplierTab row={row} setShowTabs={setShowTabs} />;
          },
          tabName: "Detail",
        },
      ]}
      config={{
        onDeleteRowsBtnClick: deleteSuppliers, // if null, remove button
        defaultVisibilityState: supplierDefaultVisibilityState,
      }}
    />
  );
}

const DetailSupplierTab = ({
  row,
  setShowTabs,
}: {
  row: Row<Supplier>;
  setShowTabs: (value: boolean) => any;
}) => {
  const supplier = row.original;
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();

  return (
    <div className="py-2">
      <div className="flex flex-row gap-2">
        <div className="flex flex-1 flex-row text-[0.8rem]">
          <div className="flex flex-1 flex-col gap-1 pr-4">
            <DefaultInformationCellDataTable
              title="Supplier id:"
              value={supplier.id}
            />
            <DefaultInformationCellDataTable
              title="Name:"
              value={supplier.name}
            />
            <DefaultInformationCellDataTable
              title="Email:"
              value={supplier.email}
            />
            <DefaultInformationCellDataTable
              title="Phone number:"
              value={supplier.phoneNumber}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1 pr-4">
            <DefaultInformationCellDataTable
              title="Address"
              value={supplier.address}
            />
            <DefaultInformationCellDataTable
              title="Group"
              value={supplier.supplierGroupName}
            />
            <DefaultInformationCellDataTable
              title="Status"
              value={supplier.status}
            />
            <div>
              <p className="mb-2">Description</p>
              <textarea
                readOnly
                className={cn(
                  "h-[80px] w-full resize-none rounded-sm border-2 p-1",
                  scrollbar_style.scrollbar,
                )}
                defaultValue={supplier.description}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1" />
        <UpdateSupplierDialog
          DialogTrigger={
            <Button variant={"green"} disabled={disableDeleteButton}>
              <PenLine size={16} className="mr-2" />
              Update
              {disableDeleteButton ? <LoadingCircle /> : null}
            </Button>
          }
          supplier={supplier}
        />
        <Button
          variant={"red"}
          onClick={(e) => {
            setDisableDeleteButton(true);
            SupplierService.deleteSupplier(supplier.id)
              .then((result) => {
                dispatch(deleteSupplier(supplier.id));
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
      </div>
    </div>
  );
};
