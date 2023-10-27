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
import { PageWithFilters, SearchFilter } from "@/components/ui/filter";

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

const groupList = ["Family", "Single"];

const branchList = ["Center Branch", "Branch 1", "Branch 2", "Branch 3"];

export default function StaffInfoPage() {
  const [customerList, setCustomerList] = useState<Customer[]>([]);

  useEffect(() => {
    setCustomerList(originalCustomerList);
  }, []);

  function handleFormSubmit(values: Customer) {
    setCustomerList((prev) => [...prev, values]);
  }

  // const filters = [
  //   <div key={1} className="flex flex-col space-y-2">
  //     <SearchFilter
  //       key={1}
  //       title="Customer Group"
  //       choices={Array.from(new Set(customerList.map(customer => customer.customerGroup)))}
  //       alwaysOpen
  //       onValuesChanged={handleTransactionTypeChange}
  //     />

  //     <ChoicesFilter
  //       key={2}
  //       title="Form Type"
  //       choices={Object.values(FormType)}
  //       isSingleChoice={false}
  //       defaultPositions={defaultFilterPosition.defaultFormTypePosition}
  //       onMultiChoicesChanged={handleFormTypeChange}
  //     />

  //     <ChoicesFilter
  //       key={3}
  //       title="Status"
  //       choices={Object.values(Status)}
  //       isSingleChoice={false}
  //       defaultPositions={defaultFilterPosition.defaultStatusPosition}
  //       onMultiChoicesChanged={handleStatusChange}
  //     />

  //     <SearchFilter
  //       key={4}
  //       choices={salesList.map((row) => row.creator)}
  //       title="Creator"
  //       placeholder="Select creator"
  //       alwaysOpen
  //       onValuesChanged={handleCreatorChange}
  //     />

  //     <ChoicesFilter
  //       key={5}
  //       title="Receiver/Payer Type"
  //       choices={Object.values(TargetType)}
  //       isSingleChoice={false}
  //       defaultPositions={defaultFilterPosition.defaultTargetTypePosition}
  //       onMultiChoicesChanged={handleTargetTypeChange}
  //     />

  //     <SearchFilter
  //       key={6}
  //       title="Receiver/Payer"
  //       choices={salesList.map((row) => row.targetName)}
  //       placeholder="Select reveiver/payer"
  //       alwaysOpen
  //       onValuesChanged={handleTargetNameChange}
  //     />
  //   </div>,
  // ];

  return (
    <div></div>
    // <PageWithFilters title="Customer" filters={filters} headerButtons={}>
    //   <DataTable data={customerList} onSubmit={handleFormSubmit} />
    // </PageWithFilters>
  );
}
