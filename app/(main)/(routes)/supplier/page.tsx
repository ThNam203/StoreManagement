"use client";

import { Button } from "@/components/ui/button";
import {
  PageWithFilters,
  SearchFilter,
  SingleChoiceFilter,
} from "@/components/ui/filter";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setInvoices } from "@/reducers/invoicesReducer";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import InvoiceService from "@/services/invoiceService";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SupplierDatatable } from "./datatable";
import NewSupplierDialog from "@/components/component/new_supplier_dialog";
import { setSuppliers } from "@/reducers/suppliersReducer";
import SupplierService from "@/services/supplierService";
import { setSupplierGroups } from "@/reducers/supplierGroupsReducer";
import { SupplierStatuses } from "@/entities/Supplier";
import { handleChoiceFilters } from "@/utils";

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
  const productGroups = useAppSelector((state) => state.supplierGroups.value);

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
      .catch((e) => axiosUIErrorHandler(e, toast, router))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);

  const [filterConditions, setFilterConditions] = useState({
    supplierGroup: [] as string[],
  });

  const [statusCondition, setStatusCondition] = useState("All");

  useEffect(() => {
    let filteredValues = handleChoiceFilters(filterConditions, suppliers);
    filteredValues = filteredValues.filter((supplier) => {
      if (statusCondition !== "All" && supplier.status !== statusCondition) {
        return false;
      }
      return true;
    });
    setFilteredSuppliers(filteredValues);
  }, [filterConditions, statusCondition, suppliers]);

  const filters = [
    <SearchFilter
      key={1}
      placeholder="Find group..."
      title="Product group"
      chosenValues={filterConditions.supplierGroup}
      choices={productGroups.map((group) => group.name)}
      onValuesChanged={(values) => {
        setFilterConditions({ ...filterConditions, supplierGroup: values });
      }}
      className="mb-2"
    />,
    <SingleChoiceFilter
      key={2}
      title="Status"
      choices={[...Object.values(SupplierStatuses), "All"]}
      value={statusCondition}
      onValueChanged={(value) => setStatusCondition(value)}
    />,
  ];

  return (
    <PageWithFilters
      title="Supplier"
      filters={filters}
      headerButtons={[<NewInvoiceButton key={1} />]}
    >
      <SupplierDatatable data={filteredSuppliers} />
    </PageWithFilters>
  );
}
