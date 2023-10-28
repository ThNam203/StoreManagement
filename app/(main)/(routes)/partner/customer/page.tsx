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
import { AddCustomerDialog } from "./add_customer_dialog";
import { Customer, CustomerType, Status } from "@/entities/Customer";
import {
  PageWithFilters,
  RangeFilter,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";

const originalCustomerList: Customer[] = [
  {
    id: nanoid(9).toUpperCase(),
    name: "David Silva",
    customerType: CustomerType.SINGLE,
    customerGroup: "",
    phoneNumber: "0123456789",
    address: "222 ABC Street",
    sex: "male",
    email: "david@gmail.com",
    birthday: "1/1/1980",
    creator: "",
    createdDate: new Date().toLocaleString(),
    company: "ABC Company",
    taxId: nanoid(9),
    note: "",
    lastTransaction: new Date().toLocaleString(),
    debt: 100000,
    sale: 2000000,
    finalSale: 1900000,
    status: Status.WORKING,
  },
  {
    id: nanoid(9).toUpperCase(),
    name: "Harry",
    customerType: CustomerType.SINGLE,
    customerGroup: "",
    phoneNumber: "0123456789",
    address: "222 ABC Street",
    sex: "male",
    email: "harry@gmail.com",
    birthday: "1/1/1980",
    creator: "",
    createdDate: new Date().toLocaleString(),
    company: "ABC Company",
    taxId: nanoid(9),
    note: "",
    lastTransaction: new Date().toLocaleString(),
    debt: 100000,
    sale: 2000000,
    finalSale: 1900000,
    status: Status.WORKING,
  },
  {
    id: nanoid(9).toUpperCase(),
    name: "John",
    customerType: CustomerType.SINGLE,
    customerGroup: "",
    phoneNumber: "0123456789",
    address: "222 ABC Street",
    sex: "male",
    email: "john@gmail.com",
    birthday: "1/1/1980",
    creator: "",
    createdDate: new Date().toLocaleString(),
    company: "ABC Company",
    taxId: nanoid(9),
    note: "",
    lastTransaction: new Date().toLocaleString(),
    debt: 100000,
    sale: 2000000,
    finalSale: 1900000,
    status: Status.WORKING,
  },
];

export default function StaffInfoPage() {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [filter, setFilter] = useState({
    customerGroup: [] as string[],
    createdDate: [] as string[],
    birthday: [] as string[],
    lastTransaction: [] as string[],
    sale: [] as number[],
    debt: [] as number[],
    customerType: [] as string[],
    sex: [] as string[],
    status: [] as string[],
  });

  useEffect(() => {
    setCustomerList(originalCustomerList);
  }, []);

  function handleFormSubmit(values: Customer) {
    setCustomerList((prev) => [...prev, values]);
  }

  const updateCustomerGroupFilter = (values: string[]) => {
    setFilter((prev) => ({ ...prev, customerGroup: values }));
  };
  const updateCreatedDateFilter = (values: string[]) => {
    setFilter((prev) => ({ ...prev, createdDate: values }));
  };
  const updateBirthdayFilter = (values: string[]) => {
    setFilter((prev) => ({ ...prev, birthday: values }));
  };
  const updateLastTransactionFilter = (values: string[]) => {
    setFilter((prev) => ({ ...prev, lastTransaction: values }));
  };
  const updateSaleFilter = (values: string[]) => {
    const ivalues: number[] = values.map((value) => Number.parseInt(value));
    setFilter((prev) => ({ ...prev, sale: ivalues }));
  };
  const updateDebtFilter = (values: string[]) => {
    const ivalues: number[] = values.map((value) => Number.parseInt(value));
    setFilter((prev) => ({ ...prev, debt: ivalues }));
  };
  const updateCustomerTypeFilter = (values: string[]) => {
    setFilter((prev) => ({ ...prev, customerType: values }));
  };
  const updateSexFilter = (values: string[]) => {
    setFilter((prev) => ({ ...prev, sex: values }));
  };
  const updateStatusFilter = (values: string[]) => {
    setFilter((prev) => ({ ...prev, status: values }));
  };

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <SearchFilter
        key={1}
        title="Customer Group"
        placeholder="Select customer group"
        choices={Array.from(
          customerList.map((customer) => customer.customerGroup)
        )}
        chosenValues={filter.customerGroup}
        alwaysOpen
        onValuesChanged={updateCustomerGroupFilter}
      />
      {/* <TimeFilter 
        key={2}
        
      /> */}
      <RangeFilter key={2} startValue={0} endValue={0} title="Date Modified" />
    </div>,
  ];

  return (
    <PageWithFilters title="Customer" filters={filters} headerButtons={[]}>
      <DataTable data={customerList} onSubmit={handleFormSubmit} />
    </PageWithFilters>
  );
}
