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
import { columnHeader } from "./columns";
import {
  FormType,
  Status,
  TargetType,
  Transaction,
  TransactionType,
} from "@/entities/Transaction";
import {
  ChoicesFilter,
  PageWithFilters,
  SearchFilter,
} from "@/components/ui/filter";
import { Button } from "@/components/ui/button";
import { filterTable } from "@/utils";
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
    const newSaleList: Transaction[] = filterTable<Transaction>(
      filter,
      salesList
    );
    setFilterSaleList([...newSaleList]);
  }, [filter, salesList]);

  //function
  function handleFormSubmit(values: Transaction) {
    setSalesList((prev) => [...prev, values]);
  }

  const updateTransactionTypeFilter = (values: string[]) => {
    setFilter((prev) => ({ ...prev, transactionType: values }));
  };
  const updateFormTypeFilter = (values: string[]) => {
    setFilter((prev) => ({ ...prev, formType: values }));
  };
  const updateStatusFilter = (values: string[]) => {
    setFilter((prev) => ({ ...prev, status: values }));
  };
  const updateCreatorFilter = (values: string[]) => {
    setFilter((prev) => ({ ...prev, creator: values }));
  };
  const updateTargetTypeFilter = (values: string[]) => {
    setFilter((prev) => ({ ...prev, targetType: values }));
  };
  const updateTargetNameFilter = (values: string[]) => {
    setFilter((prev) => ({ ...prev, targetName: values }));
  };

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <ChoicesFilter
        key={1}
        title="Transaction Type"
        choices={Object.values(TransactionType)}
        isSingleChoice={false}
        defaultValues={filter.transactionType}
        onMultiChoicesChanged={updateTransactionTypeFilter}
      />

      <ChoicesFilter
        key={2}
        title="Form Type"
        choices={Object.values(FormType)}
        isSingleChoice={false}
        defaultValues={filter.formType}
        onMultiChoicesChanged={updateFormTypeFilter}
      />

      <ChoicesFilter
        key={3}
        title="Status"
        choices={Object.values(Status)}
        isSingleChoice={false}
        defaultValues={filter.status}
        onMultiChoicesChanged={updateStatusFilter}
      />

      <SearchFilter
        key={4}
        choices={Array.from(new Set(salesList.map((row) => row.creator)))}
        chosenValues={filter.creator}
        title="Creator"
        placeholder="Select creator"
        alwaysOpen
        onValuesChanged={updateCreatorFilter}
      />

      <ChoicesFilter
        key={5}
        title="Receiver/Payer Type"
        choices={Object.values(TargetType)}
        isSingleChoice={false}
        defaultValues={filter.targetType}
        onMultiChoicesChanged={updateTargetTypeFilter}
      />

      <SearchFilter
        key={6}
        title="Receiver/Payer"
        chosenValues={filter.targetName}
        choices={Array.from(new Set(salesList.map((row) => row.targetName)))}
        placeholder="Select reveiver/payer"
        alwaysOpen
        onValuesChanged={updateTargetNameFilter}
      />
    </div>,
  ];

  const headerButtons = [<Button key={0}>More+</Button>];

  return (
    <PageWithFilters
      title="Fund Ledger"
      filters={filters}
      headerButtons={headerButtons}
    >
      <DataTable data={filteredSaleList} onSubmit={handleFormSubmit} />
    </PageWithFilters>
  );
}
