"use client"

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
import { useEffect, useState } from "react";
import ChooseInvoiceToReturnDialog from "@/components/component/choose_invoice_to_return_dialog";
import ReturnInvoiceService from "@/services/return_invoice_service";
import { setReturnInvoices } from "@/reducers/returnInvoicesReducer";
import { ReturnDatatable } from "./datatable";
import StaffService from "@/services/staff_service";
import { setStaffs } from "@/reducers/staffReducer";

export default function ReturnPage() {
  const router = useRouter()
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const NewInvoiceButton = () => {
    const [openDialog, setOpenDialog] = useState(false)
    return (
      <>
        <Button variant={"green"} onClick={() => setOpenDialog(true)}>
          <Plus size={16} className="mr-2" />
          New Return
        </Button>
        <ChooseInvoiceToReturnDialog open={openDialog} onOpenChange={setOpenDialog} invoices={invoices}/>
      </>
    );
  };

  const invoices = useAppSelector((state) => state.invoices.value)
  const returnInvoices = useAppSelector((state) => state.returnInvoices.value)

  useEffect(() => {
    dispatch(showPreloader())
    const fetchData = async () => {
      const invoices = await InvoiceService.getAllInvoices()
      dispatch(setInvoices(invoices.data))
      const returnInvoices = await ReturnInvoiceService.getAllReturnInvoices()
      dispatch(setReturnInvoices(returnInvoices.data))
      const staffs = await StaffService.getAllStaffs()
      dispatch(setStaffs(staffs.data))
    }

    fetchData().then().catch(e => axiosUIErrorHandler(e, toast)).finally(() => dispatch(disablePreloader()))
  }, [])

  return (
    <PageWithFilters
      title="Returns"
      filters={[]}
      headerButtons={[<NewInvoiceButton key={1} />]}
    >
      <ReturnDatatable data={returnInvoices} router={router}/>
    </PageWithFilters>
  );
}
