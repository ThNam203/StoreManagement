"use client";

import { Button } from "@/components/ui/button";
import { PageWithFilters } from "@/components/ui/filter";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setInvoices } from "@/reducers/invoicesReducer";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import InvoiceService from "@/services/invoice_service";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SupplierDatatable } from "./datatable";
import NewSupplierDialog from "@/components/component/new_supplier_dialog";
import { setSuppliers } from "@/reducers/suppliersReducer";
import SupplierService from "@/services/supplier_service";
import { setSupplierGroups } from "@/reducers/supplierGroupsReducer";

export default function InvoicePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const NewInvoiceButton = () => {
    return (
      <NewSupplierDialog
        DialogTrigger={
          <Button variant={"green"}>
            <Plus size={16} className="mr-2" />
            New Supplier
          </Button>
        }
      />
    );
  };

  const suppliers = useAppSelector((state) => state.suppliers.value);

  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const suppliers = await SupplierService.getAllSuppliers();
      dispatch(setSuppliers(suppliers.data));
      const supplierGroups = await SupplierService.getAllSupplierGroups();
      dispatch(setSupplierGroups(supplierGroups.data));
    };

    fetchData()
      .then()
      .catch((e) => axiosUIErrorHandler(e, toast))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  return (
    <PageWithFilters
      title="Supplier"
      filters={[]}
      headerButtons={[<NewInvoiceButton key={1} />]}
    >
      <SupplierDatatable data={suppliers} />
    </PageWithFilters>
  );
}
