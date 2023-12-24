"use client";

import { Button } from "@/components/ui/button";
import { PageWithFilters } from "@/components/ui/filter";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setInvoices } from "@/reducers/invoicesReducer";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import InvoiceService from "@/services/invoiceService";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { InvoiceDatatable } from "./datatable";

export default function InvoicePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const NewInvoiceButton = () => {
    return (
      <Button variant={"green"} onClick={() => router.push("/sale")}>
        <Plus size={16} className="mr-2" />
        New Invoice
      </Button>
    );
  };

  const invoices = useAppSelector((state) => state.invoices.value);

  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const invoices = await InvoiceService.getAllInvoices();
      dispatch(setInvoices(invoices.data));
    };

    fetchData()
      .then()
      .catch((e) => axiosUIErrorHandler(e, toast))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  return (
    <PageWithFilters
      title="Invoices"
      filters={[]}
      headerButtons={[<NewInvoiceButton key={1} />]}
    >
      <InvoiceDatatable data={invoices} router={router} />
    </PageWithFilters>
  );
}
