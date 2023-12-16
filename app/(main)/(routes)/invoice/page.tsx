"use client"

import { Button } from "@/components/ui/button";
import { PageWithFilters } from "@/components/ui/filter";
import { useAppSelector } from "@/hooks";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InvoicePage() {
const router = useRouter()

  const NewInvoiceButton = () => {
    return (
      <Button variant={"green"} onClick={() => router.push('/sale')}>
        <Plus size={16} className="mr-2" />
        New Invoice
      </Button>
    );
  };

  const invoices = useAppSelector((state) => state.invoices.value)

  return (
    <PageWithFilters
      title="Products"
      filters={[]}
      headerButtons={[<NewInvoiceButton key={1} />]}
    >
      {/* <CatalogDatatable data={products} onProductUpdateButtonClicked={onProductUpdateButtonClicked}/> */}
      <div></div>
    </PageWithFilters>
  );
}
