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
import { CustomerDatatable } from "./datatable";
import CustomerService from "@/services/customer_service";
import { setCustomers } from "@/reducers/customersReducer";
import NewCustomerDialog from "@/components/component/new_customer_dialog";
import { setCustomerGroup } from "@/reducers/customerGroupsReducer";

export default function InvoicePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const NewInvoiceButton = () => {
    return (
      <NewCustomerDialog
        DialogTrigger={
          <Button variant={"green"}>
            <Plus size={16} className="mr-2" />
            New Customer
          </Button>
        }
      />
    );
  };

  const invoices = useAppSelector((state) => state.invoices.value);
  const customers = useAppSelector((state) => state.customers.value);

  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const invoices = await InvoiceService.getAllInvoices();
      dispatch(setInvoices(invoices.data));
      const customers = await CustomerService.getAllCustomers();
      dispatch(setCustomers(customers.data));
      const customerGroups = await CustomerService.getAllCustomerGroups();
      dispatch(setCustomerGroup(customerGroups.data));
    };

    fetchData()
      .then()
      .catch((e) => axiosUIErrorHandler(e, toast))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  return (
    <PageWithFilters
      title="Customers"
      filters={[]}
      headerButtons={[<NewInvoiceButton key={1} />]}
    >
      <CustomerDatatable data={customers} />
    </PageWithFilters>
  );
}
