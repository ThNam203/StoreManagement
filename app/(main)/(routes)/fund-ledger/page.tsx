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
import Filter from "@/components/ui/filter";
import { columnHeader } from "./columns";
const originalSalesList: Transaction[] = [
  {
    id: nanoid(9).toUpperCase(),
    targetType: TargetType.CUSTOMER,
    targetName: "David",
    formType: FormType.RECEIPT,
    description: "Receive from Customer",
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
    description: "Receive from Customer",
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
    description: "Pay for Supplier",
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
  const [filter, setFilter] = useState({});
  const [filteredSaleList, setFilteredSaleList] = useState([]);

  useEffect(() => {
    setSalesList(originalSalesList);
  }, []);

  function handleFormSubmit(values: Transaction) {
    setSalesList((prev) => [...prev, values]);
  }

  useEffect(() => {
    console.log(filter);
  }, [filter]);

  const handleMultiFilterChange = (
    position: number[],
    prop: string,
    value: boolean | string
  ) => {
    if (value !== "indeterminate")
      setFilter((prev) => ({ ...prev, [prop]: value }));
    else setFilter((prev) => ({ ...prev, [prop]: null }));
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-start-1 col-span-5">
        <div className="w-full p-4 rounded-lg bg-white overflow-hidden">
          <h2 className="text-start font-semibold text-3xl my-4">
            Fund Ledger
          </h2>
          <DataTable data={salesList} onSubmit={handleFormSubmit} />
        </div>
      </div>
      <div className="col-start-6 col-span-1">
        <div className="w-full flex flex-col space-y-4">
          <Filter
            title="Transaction Type"
            choices={Object.values(TransactionType)}
            isSingleChoice={false}
            onMultiChoicesChanged={handleMultiFilterChange}
          />
          <Filter
            title="Form Type"
            choices={Object.values(FormType)}
            isSingleChoice={false}
            onMultiChoicesChanged={handleMultiFilterChange}
          />
          <Filter
            title="Status"
            choices={Object.values(Status)}
            isSingleChoice={false}
            onMultiChoicesChanged={handleMultiFilterChange}
          />
          <Filter
            title="Creator"
            choices={salesList.map((row) => row.creator)}
            isSingleChoice={false}
            onMultiChoicesChanged={handleMultiFilterChange}
          />
          <Filter
            title="Receiver/Payer Type"
            choices={salesList.map((row) => row.targetType)}
            isSingleChoice={false}
          />
          <Filter
            title="Receiver/Payer"
            choices={salesList.map((row) => row.targetName)}
            isSingleChoice={false}
          />
        </div>
      </div>
    </div>
  );
}
