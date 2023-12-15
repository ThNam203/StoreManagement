import { Invoice } from "@/entities/Invoice";
import { X } from "lucide-react";
import { CustomDatatable } from "./custom_datatable";
import { ColumnDef } from "@tanstack/react-table";
import { defaultColumn } from "../ui/my_table_default_column";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

const columnTitles = {
  id: "Invoice ID",
  createdAt: "Time",
  staffId: "Staff ID",
  customerId: "Customer ID",
  total: "Total",
};

const actionColumn = (router: AppRouterInstance): ColumnDef<Invoice> => ({
  id: "actions",
  enableHiding: false,
  cell: ({ row }) => {
    const invoice = row.original;
    return (
      <Button
        variant={"blue"}
        className="h-[30px]"
        onClick={() => router.push(`/invoice-return?invoiceId=${invoice.id}`)}
      >
        Choose
      </Button>
    );
  },
});

const columns = (router: AppRouterInstance) => {
  const rs: ColumnDef<Invoice>[] = [];
  for (const key in columnTitles) rs.push(defaultColumn(key, columnTitles));
  rs.push(actionColumn(router));
  return rs;
};

// same as popover
export default function ChooseInvoiceToReturnDialog({
  invoices,
  open,
  onOpenChange,
}: {
  invoices: Invoice[];
  open: boolean;
  onOpenChange: (value: boolean) => any;
}) {
  const router = useRouter();
  return open ? (
    <div className="fixed left-0 top-0 z-20 flex h-screen w-screen items-center bg-slate-300 bg-opacity-70">
      <div className="mx-auto flex max-h-96 max-w-4xl flex-col rounded-lg bg-white p-6">
        <div className="flex justify-between">
          <h4>Choose invoice to make return</h4>
          <X size={16} onClick={() => onOpenChange(false)} />
        </div>
        <CustomDatatable
          data={invoices}
          columns={columns(router)}
          columnTitles={columnTitles}
          config={{
            showDataTableViewOptions: false,
            showExportButton: false,
          }}
        />
      </div>
    </div>
  ) : null;
}
