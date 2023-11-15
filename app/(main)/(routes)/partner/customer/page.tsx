"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { nanoid } from "nanoid";

import { Combobox } from "@/components/ui/my_combobox";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import { AddCustomerDialog } from "./add_customer_dialog";
import {
  Customer,
  CustomerType,
  Sex,
  Status,
  getFinalSale,
} from "@/entities/Customer";
import {
  ChoicesFilter,
  FilterTime,
  FilterYear,
  PageWithFilters,
  RangeFilter,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";
import {
  TimeFilterType,
  formatID,
  getMinMaxOfListTime,
  getStaticRangeFilterTime,
  handleMultipleFilter,
  handleRangeNumFilter,
  handleRangeTimeFilter,
  handleSingleFilter,
  handleTimeFilter,
} from "@/utils";

const originalCustomerList: Customer[] = [
  {
    id: 1,
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
    image: "",
  },
  {
    id: 2,
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
    debt: 0,
    sale: 0,
    finalSale: 0,
    status: Status.NOT_WORKING,
    image: "",
  },
  {
    id: 3,
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
    image: "",
  },
];

export default function CustomerPage() {
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
  const [staticRangeFilter, setStaticRangeFilter] = useState({
    createdDate: FilterYear.AllTime as FilterTime,
    birthday: FilterYear.AllTime as FilterTime,
    lastTransaction: FilterYear.AllTime as FilterTime,
  });
  const [rangeTimeFilter, setRangeTimeFilter] = useState({
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
  const [timeFilterControl, setTimeFilterControl] = useState({
    createdDate: TimeFilterType.StaticRange as TimeFilterType,
    birthday: TimeFilterType.StaticRange as TimeFilterType,
    lastTransaction: TimeFilterType.StaticRange as TimeFilterType,
  });

  const [rangeNumFilter, setRangeNumFilter] = useState({
    sale: { startValue: NaN, endValue: NaN },
    debt: { startValue: NaN, endValue: NaN },
  });

  useEffect(() => {
    const res = originalCustomerList;
    const formatedData: Customer[] = res.map((row) => {
      const newRow = { ...row };
      newRow.id = formatID(newRow.id, "KH");
      return newRow;
    });
    setCustomerList(formatedData);
  }, []);

  useEffect(() => {
    var filteredList = [...customerList];
    filteredList = handleMultipleFilter(multiFilter, filteredList);
    filteredList = handleTimeFilter(
      staticRangeFilter,
      rangeTimeFilter,
      timeFilterControl,
      filteredList
    );
    filteredList = handleRangeNumFilter(rangeNumFilter, filteredList);

    setFilteredCustomerList([...filteredList]);
  }, [
    multiFilter,
    staticRangeFilter,
    rangeTimeFilter,
    timeFilterControl,
    rangeNumFilter,
    customerList,
  ]);

  function handleFormSubmit(values: Customer) {
    setCustomerList((prev) => [...prev, values]);
  }

  const updateCustomerGroupMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, customerGroup: values }));
  };

  const updateCreatedDateStaticRangeFilter = (value: FilterTime) => {
    setStaticRangeFilter((prev) => ({ ...prev, createdDate: value }));
  };
  const updateCreatedDateRangeTimeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeTimeFilter((prev) => ({ ...prev, createdDate: range }));
  };
  const updateCreatedDateFilterControl = (value: TimeFilterType) => {
    setTimeFilterControl((prev) => ({ ...prev, createdDate: value }));
  };
  const updateBirthdayRangeTimeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeTimeFilter((prev) => ({ ...prev, birthday: range }));
  };
  const updateBirthdayStaticRangeFilter = (value: FilterTime) => {
    setStaticRangeFilter((prev) => ({ ...prev, birthday: value }));
  };
  const updateBirthdayFilterControl = (value: TimeFilterType) => {
    setTimeFilterControl((prev) => ({ ...prev, birthday: value }));
  };
  const updateLastTransactionRangeTimeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeTimeFilter((prev) => ({ ...prev, lastTransaction: range }));
  };
  const updateLastTransactionStaticRangeFilter = (value: FilterTime) => {
    setStaticRangeFilter((prev) => ({ ...prev, lastTransaction: value }));
  };
  const updateLastTransactionFilterControl = (value: TimeFilterType) => {
    setTimeFilterControl((prev) => ({ ...prev, lastTransaction: value }));
  };
  const updateSaleRangeNumFilter = (range: {
    startValue: number;
    endValue: number;
  }) => {
    setRangeNumFilter((prev) => ({ ...prev, sale: range }));
  };
  const updateDebtRangeNumFilter = (range: {
    startValue: number;
    endValue: number;
  }) => {
    setRangeNumFilter((prev) => ({ ...prev, debt: range }));
  };
  const updateCustomerTypeMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, customerType: values }));
  };
  const updateSexMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, sex: values }));
  };
  const updateStatusMultiFilter = (values: string[]) => {
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
        timeFilterControl={timeFilterControl.createdDate}
        singleTimeValue={staticRangeFilter.createdDate}
        rangeTimeValue={rangeTimeFilter.createdDate}
        onTimeFilterControlChanged={updateCreatedDateFilterControl}
        onRangeTimeFilterChanged={updateCreatedDateRangeTimeFilter}
        onSingleTimeFilterChanged={updateCreatedDateStaticRangeFilter}
      />
      <TimeFilter
        key={3}
        title="Birthday"
        timeFilterControl={timeFilterControl.birthday}
        singleTimeValue={staticRangeFilter.birthday}
        rangeTimeValue={rangeTimeFilter.birthday}
        onTimeFilterControlChanged={updateBirthdayFilterControl}
        onRangeTimeFilterChanged={updateBirthdayRangeTimeFilter}
        onSingleTimeFilterChanged={updateBirthdayStaticRangeFilter}
      />
      <TimeFilter
        key={4}
        title="Last Transaction"
        timeFilterControl={timeFilterControl.lastTransaction}
        singleTimeValue={staticRangeFilter.lastTransaction}
        rangeTimeValue={rangeTimeFilter.lastTransaction}
        onTimeFilterControlChanged={updateLastTransactionFilterControl}
        onRangeTimeFilterChanged={updateLastTransactionRangeTimeFilter}
        onSingleTimeFilterChanged={updateLastTransactionStaticRangeFilter}
      />
      <RangeFilter
        key={5}
        title="Sale"
        range={rangeNumFilter.sale}
        onValuesChanged={updateSaleRangeNumFilter}
      />
      <RangeFilter
        key={6}
        title="Debt"
        range={rangeNumFilter.debt}
        onValuesChanged={updateDebtRangeNumFilter}
      />
      <ChoicesFilter
        key={7}
        title="Customer Type"
        choices={Object.values(CustomerType)}
        isSingleChoice={false}
        defaultValues={multiFilter.customerType}
        onMultiChoicesChanged={updateCustomerTypeMultiFilter}
      />
      <ChoicesFilter
        key={8}
        title="Sex"
        choices={Object.values(Sex)}
        isSingleChoice={false}
        defaultValues={multiFilter.sex}
        onMultiChoicesChanged={updateSexMultiFilter}
      />
      <ChoicesFilter
        key={9}
        title="Status"
        choices={Object.values(Status)}
        isSingleChoice={false}
        defaultValues={multiFilter.status}
        onMultiChoicesChanged={updateStatusMultiFilter}
      />
    </div>,
  ];

  return (
    <PageWithFilters title="Customer" filters={filters} headerButtons={[]}>
      <DataTable data={filteredCustomerList} onSubmit={handleFormSubmit} />
    </PageWithFilters>
  );
}
