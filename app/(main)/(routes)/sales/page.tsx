"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { nanoid } from "nanoid";

import { Combobox } from "@/components/ui/combobox";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import {
  FormType,
  Status,
  TargetType,
  Transaction,
  TransactionType,
} from "./entities";
import { MakeExpenseDialog } from "./make_expense_dialog";
import { MakeReceiptDialog } from "./make_receipt_dialog";
const originalSalesList: Transaction[] = [
  {
    id: nanoid(9).toUpperCase(),
    targetType: TargetType.CUSTOMER,
    targetName: "David",
    formType: FormType.RECEIPT,
    transactionType: TransactionType.CASH,
    value: "100000",
    creator: "NGUYEN VAN A",
    createdDate: new Date().toLocaleString(),
    status: Status.PAID,
    note: "",
  },
  {
    id: nanoid(9).toUpperCase(),
    targetType: TargetType.CUSTOMER,
    targetName: "Henry",
    formType: FormType.RECEIPT,
    transactionType: TransactionType.TRANSFER,
    value: "200000",
    creator: "NGUYEN VAN B",
    createdDate: new Date().toLocaleString(),
    status: Status.CANCELLED,
    note: "",
  },
  {
    id: nanoid(9).toUpperCase(),
    targetType: TargetType.SUPPLIER,
    targetName: "Mary",
    formType: FormType.EXPENSE,
    transactionType: TransactionType.TRANSFER,
    value: "20000000",
    creator: "NGUYEN VAN C",
    createdDate: new Date().toLocaleString(),
    status: Status.PAID,
    note: "",
  },
];

export default function SalesPage() {
  const [salesList, setSalesList] = useState<Transaction[]>([]);

  useEffect(() => {
    setSalesList(originalSalesList);
  }, []);

  function handleFormSubmit(values: Transaction) {
    setSalesList((prev) => [...prev, values]);
  }

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-start-1 col-span-6">
        <span className="text-slate-500 text-xl cursor-default select-none">
          Fund Ledger
        </span>
      </div>
      <div className="col-start-1 col-span-5">
        <div className="p-4 rounded-lg bg-white overflow-hidden">
          <DataTable data={salesList} onSubmit={handleFormSubmit} />
        </div>
      </div>
      {/* <div className="col-start-6 col-span-1">
        <Collapsible className="rounded-lg bg-white p-4">
          <div className="flex flex-row justify-between">
            <span className="font-bold select-none">Customer Group</span>
            <CollapsibleTrigger asChild>
              <ChevronDown
                color="black"
                className="opacity-60 hover:opacity-100 cursor-pointer"
              />
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="data-[state=open]:animate-[slide-down_0.2s_ease-out] data-[state=closed]:animate-[slide-up_0.2s_ease-out] overflow-hidden mt-2">
            <Combobox placeholder="Select group..." optionList={groupList} />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible className="rounded-lg bg-white mt-4 p-4">
          <div className="flex flex-row justify-between">
            <span className="font-bold select-none">Created Date</span>
            <CollapsibleTrigger asChild>
              <ChevronDown
                color="black"
                className="opacity-60 hover:opacity-100 cursor-pointer"
              />
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="data-[state=open]:animate-[slide-down_0.2s_ease-out] data-[state=closed]:animate-[slide-up_0.2s_ease-out] overflow-hidden mt-2">
            <Combobox placeholder="Select branch..." optionList={branchList} />
          </CollapsibleContent>
        </Collapsible>
      </div> */}
    </div>
  );
}
