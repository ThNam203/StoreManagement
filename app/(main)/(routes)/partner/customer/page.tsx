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
import { Customer, CustomerType, Sex, Status } from "@/entities/Customer";
import {
  ChoicesFilter,
  PageWithFilters,
  RangeFilter,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";
import {
  handleMultipleFilter,
  handleRangeFilter,
  handleSingleFilter,
} from "@/utils";

const originalCustomerList: Customer[] = [
  {
    id: nanoid(9).toUpperCase(),
    name: "David Silva",
    customerType: CustomerType.SINGLE,
    customerGroup: "",
    phoneNumber: "0123456789",
    address: "222 ABC Street",
    sex: Sex.MALE,
    email: "david@gmail.com",
    birthday: new Date(),
    creator: "",
    createdDate: new Date(),
    company: "ABC Company",
    taxId: nanoid(9),
    note: "",
    lastTransaction: new Date(),
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
    sex: Sex.MALE,
    email: "harry@gmail.com",
    birthday: new Date(),
    creator: "",
    createdDate: new Date(),
    company: "ABC Company",
    taxId: nanoid(9),
    note: "",
    lastTransaction: new Date(),
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
    sex: Sex.MALE,
    email: "john@gmail.com",
    birthday: new Date(),
    creator: "",
    createdDate: new Date(),
    company: "ABC Company",
    taxId: nanoid(9),
    note: "",
    lastTransaction: new Date(),
    debt: 100000,
    sale: 2000000,
    finalSale: 1900000,
    status: Status.WORKING,
  },
];

export default function StaffInfoPage() {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [filteredCustomerList, setFilteredCustomerList] = useState<Customer[]>(
    []
  );
  const [multiFilter, setMultiFilter] = useState({
    customerGroup: [] as string[],
    customerType: [] as string[],
    sale: [] as number[],
    debt: [] as number[],
    sex: [] as string[],
    status: [] as string[],
  });
  const [rangeFilter, setRangeFilter] = useState({
    createdDate: {
      startDate: new Date(),
      endDate: new Date(),
    },
    birthday: {
      startDate: new Date(),
      endDate: new Date(),
    },
    lastTransaction: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  useEffect(() => {
    setCustomerList(originalCustomerList);
  }, []);

  useEffect(() => {
    var filteredList = [...customerList];
    filteredList = handleMultipleFilter(multiFilter, filteredList);
    filteredList = handleRangeFilter(rangeFilter, filteredList);

    setFilteredCustomerList([...filteredList]);
  }, [multiFilter, rangeFilter, customerList]);

  function handleFormSubmit(values: Customer) {
    setCustomerList((prev) => [...prev, values]);
  }

  const updateCustomerGroupMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, customerGroup: values }));
  };
  const updateCreatedDateRangeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeFilter((prev) => ({ ...prev, createdDate: range }));
  };
  const updateBirthdayRangeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeFilter((prev) => ({ ...prev, birthday: range }));
  };
  const updateLastTransactionRangeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeFilter((prev) => ({ ...prev, lastTransaction: range }));
  };
  const updateSaleFilter = (values: string[]) => {
    const ivalues: number[] = values.map((value) => Number.parseInt(value));
    setMultiFilter((prev) => ({ ...prev, sale: ivalues }));
  };
  const updateDebtFilter = (values: string[]) => {
    const ivalues: number[] = values.map((value) => Number.parseInt(value));
    setMultiFilter((prev) => ({ ...prev, debt: ivalues }));
  };
  const updateCustomerTypeMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, customerType: values }));
  };
  const updateSexMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, sex: values }));
  };
  const updateStatusFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, status: values }));
  };

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <SearchFilter
        key={1}
        title="Customer Group"
        placeholder="Select customer group"
        choices={Array.from(
          new Set(customerList.map((customer) => customer.customerGroup))
        )}
        chosenValues={multiFilter.customerGroup}
        onValuesChanged={updateCustomerGroupMultiFilter}
      />
      <TimeFilter
        key={2}
        title="Date Modified"
        usingSingleTime={false}
        defaultRangeTime={rangeFilter.createdDate}
        onRangeTimeFilterChanged={updateCreatedDateRangeFilter}
      />
      <TimeFilter
        key={3}
        title="Birthday"
        usingSingleTime={false}
        defaultRangeTime={rangeFilter.birthday}
        onRangeTimeFilterChanged={updateBirthdayRangeFilter}
      />
      <TimeFilter
        key={4}
        title="Last Transaction"
        usingSingleTime={false}
        defaultRangeTime={rangeFilter.lastTransaction}
        onRangeTimeFilterChanged={updateLastTransactionRangeFilter}
      />
      <ChoicesFilter
        key={5}
        title="Customer Type"
        choices={Object.values(CustomerType)}
        isSingleChoice={false}
        defaultValues={multiFilter.customerType}
        onMultiChoicesChanged={updateCustomerTypeMultiFilter}
      />
      <ChoicesFilter
        key={6}
        title="Sex"
        choices={Object.values(Sex)}
        isSingleChoice={false}
        defaultValues={multiFilter.sex}
        onMultiChoicesChanged={updateSexMultiFilter}
      />
    </div>,
  ];

  return (
    <PageWithFilters title="Customer" filters={filters} headerButtons={[]}>
      <DataTable data={filteredCustomerList} onSubmit={handleFormSubmit} />
    </PageWithFilters>
  );
}
