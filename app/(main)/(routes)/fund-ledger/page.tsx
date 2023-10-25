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

import { MakeExpenseDialog } from "./make_expense_dialog";
import { MakeReceiptDialog } from "./make_receipt_dialog";
import Filter from "@/components/ui/filter";
import { columnHeader } from "./columns";
import {
  FormType,
  Status,
  TargetType,
  Transaction,
  TransactionType,
} from "@/entities/Transaction";
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
  const [filteredSaleList, setFilterSaleList] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState({
    transactionType: [] as string[],
    formType: [] as string[],
    status: [] as string[],
    creator: [] as string[],
    targetType: [] as string[],
    targetName: [] as string[],
  });
  const [defaultFilterPosition, setDefaultFilterPosition] = useState({
    defaultTransactionTypePosition: [] as number[],
    defaultFormTypePosition: [] as number[],
    defaultStatusPosition: [] as number[],
    defaultCreatorPosition: [] as number[],
    defaultTargetTypePosition: [] as number[],
    defaultTargetNamePosition: [] as number[],
  });

  // hook use effect
  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        const res = originalSalesList;
        setSalesList(res);
      }, 1000);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const newSaleList: Transaction[] = salesList.filter((row) => {
      if (
        filter.transactionType.length > 0 &&
        !filter.transactionType.includes(row.transactionType.toString())
      )
        return false;
      if (
        filter.formType.length > 0 &&
        !filter.formType.includes(row.formType.toString())
      )
        return false;
      if (
        filter.status.length > 0 &&
        !filter.status.includes(row.status.toString())
      )
        return false;
      if (
        filter.creator.length > 0 &&
        !filter.creator.includes(row.creator.toString())
      )
        return false;
      if (
        filter.targetType.length > 0 &&
        !filter.targetType.includes(row.targetType.toString())
      )
        return false;
      if (
        filter.targetName.length > 0 &&
        !filter.targetName.includes(row.targetName.toString())
      )
        return false;
      return true;
    });
    console.log("new sale list:", newSaleList);
    setFilterSaleList([...newSaleList]);
  }, [filter, salesList]);

  //function
  function handleFormSubmit(values: Transaction) {
    setSalesList((prev) => [...prev, values]);
  }

  const handleTransactionTypeChange = (
    position: number[],
    values: string[]
  ) => {
    if (values.length > 0)
      setFilter((prev) => ({ ...prev, transactionType: values }));
    else
      setFilter((prev) => ({
        ...prev,
        transactionType: Object.values(TransactionType),
      }));
  };

  const handleFormTypeChange = (position: number[], values: string[]) => {
    if (values.length > 0) setFilter((prev) => ({ ...prev, formType: values }));
    else setFilter((prev) => ({ ...prev, formType: Object.values(FormType) }));
  };
  const handleStatusChange = (position: number[], values: string[]) => {
    if (values.length > 0) setFilter((prev) => ({ ...prev, status: values }));
    else setFilter((prev) => ({ ...prev, status: Object.values(Status) }));
  };
  const handleCreatorChange = (position: number[], values: string[]) => {
    if (values.length > 0) setFilter((prev) => ({ ...prev, creator: values }));
    else
      setFilter((prev) => ({
        ...prev,
        creator: salesList.map((row) => row.creator),
      }));
  };
  const handleTargetTypeChange = (position: number[], values: string[]) => {
    if (values.length > 0)
      setFilter((prev) => ({ ...prev, targetType: values }));
    else
      setFilter((prev) => ({ ...prev, targetType: Object.values(TargetType) }));
  };
  const handleTargetNameChange = (position: number[], values: string[]) => {
    if (values.length > 0)
      setFilter((prev) => ({ ...prev, targetName: values }));
    else
      setFilter((prev) => ({
        ...prev,
        targetName: salesList.map((row) => row.targetName),
      }));
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-start-1 col-span-5">
        <div className="w-full p-4 rounded-lg bg-white overflow-hidden">
          <h2 className="text-start font-semibold text-3xl my-4">
            Fund Ledger
          </h2>
          <DataTable data={filteredSaleList} onSubmit={handleFormSubmit} />
        </div>
      </div>
      <div className="col-start-6 col-span-1">
        <div className="w-full flex flex-col space-y-4">
          <Filter
            title="Transaction Type"
            choices={Object.values(TransactionType)}
            isSingleChoice={false}
            defaultPositions={
              defaultFilterPosition.defaultTransactionTypePosition
            }
            onMultiChoicesChanged={handleTransactionTypeChange}
          />
          <Filter
            title="Form Type"
            choices={Object.values(FormType)}
            isSingleChoice={false}
            defaultPositions={defaultFilterPosition.defaultFormTypePosition}
            onMultiChoicesChanged={handleFormTypeChange}
          />
          <Filter
            title="Status"
            choices={Object.values(Status)}
            isSingleChoice={false}
            defaultPositions={defaultFilterPosition.defaultStatusPosition}
            onMultiChoicesChanged={handleStatusChange}
          />
          <Filter
            title="Creator"
            choices={salesList.map((row) => row.creator)}
            isSingleChoice={false}
            defaultPositions={defaultFilterPosition.defaultCreatorPosition}
            onMultiChoicesChanged={handleCreatorChange}
          />
          <Filter
            title="Receiver/Payer Type"
            choices={salesList.map((row) => row.targetType)}
            isSingleChoice={false}
            defaultPositions={defaultFilterPosition.defaultTargetTypePosition}
            onMultiChoicesChanged={handleTargetTypeChange}
          />
          <Filter
            title="Receiver/Payer"
            choices={salesList.map((row) => row.targetName)}
            isSingleChoice={false}
            defaultPositions={defaultFilterPosition.defaultTargetNamePosition}
            onMultiChoicesChanged={handleTargetNameChange}
          />
        </div>
      </div>
    </div>
  );
}
