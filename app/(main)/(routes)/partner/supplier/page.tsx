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

import { AddSupplierDialog } from "./add_supplier_dialog";
import { DataTable } from "./datatable";
import { Status, Supplier } from "@/entities/Supplier";
import {
  ChoicesFilter,
  FilterTime,
  FilterYear,
  PageWithFilters,
  RangeFilter,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";
import { Button } from "@/components/ui/button";
import {
  getMinMaxOfListTime,
  getStaticRangeFilterTime,
  handleMultipleFilter,
  handleRangeNumFilter,
  handleRangeTimeFilter,
  handleSingleFilter,
} from "@/utils";

const originalSupplierList: Supplier[] = [
  {
    id: nanoid(9).toUpperCase(),
    name: "Nha cung cap banh gao",
    phoneNumber: "0123456789",
    supplierGroup: "",
    email: "banhgao@gmail.com",
    address: "11 ABC street",
    company: "Banh gao Viet Nam",
    note: "",
    taxId: "",
    creator: "Nguyen Van A",
    createdDate: new Date(),
    debt: 0,
    sale: 0,
    totalSale: 0,
    status: Status.NOT_WORKING,
  },
  {
    id: nanoid(9).toUpperCase(),
    name: "Nha cung cap banh gai",
    phoneNumber: "0123456789",
    supplierGroup: "",
    email: "banhgai@gmail.com",
    address: "11 ABC street",
    company: "Banh gai Thanh Hoa",
    note: "",
    taxId: "",
    creator: "Nguyen Van B",
    createdDate: new Date(),
    debt: 0,
    sale: 200000,
    totalSale: 200000,
    status: Status.WORKING,
  },
  {
    id: nanoid(9).toUpperCase(),
    name: "Nha cung cap nuoc ngot",
    phoneNumber: "0123456789",
    supplierGroup: "",
    email: "cocacola@gmail.com",
    address: "11 ABC street",
    company: "CocaCola",
    note: "",
    taxId: "",
    creator: "Nguyen Van C",
    createdDate: new Date(),
    debt: 0,
    sale: 1000000,
    totalSale: 1000000,
    status: Status.WORKING,
  },
];

export default function SupplierPage() {
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [filteredSupplierList, setFilteredSupplierList] = useState<Supplier[]>(
    []
  );
  const [multiFilter, setMultiFilter] = useState({
    supplierGroup: [] as string[],
    status: [] as string[],
  });
  const [rangeTimeFilter, setRangeTimeFilter] = useState({
    createdDate: { startDate: new Date(), endDate: new Date() },
  });
  const [singleFilter, setSingleFitler] = useState({
    createdDate: FilterYear.AllTime,
  });
  const [rangeNumFilter, setRangeNumFilter] = useState({
    sale: { startValue: NaN, endValue: NaN },
    debt: { startValue: NaN, endValue: NaN },
  });

  useEffect(() => {
    setSupplierList(originalSupplierList);
  }, []);
  useEffect(() => {
    var filteredList = [...supplierList];
    filteredList = handleMultipleFilter(multiFilter, filteredList);
    filteredList = handleRangeNumFilter(rangeNumFilter, filteredList);
    filteredList = handleRangeTimeFilter(rangeTimeFilter, filteredList);

    setFilteredSupplierList([...filteredList]);
  }, [multiFilter, rangeNumFilter, rangeTimeFilter, supplierList]);

  function handleFormSubmit(values: Supplier) {
    setSupplierList((prev) => [...prev, values]);
  }

  const updateSupplierGroupMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, supplierGroup: values }));
  };
  const updateCreatedDateRangeTimeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeTimeFilter((prev) => ({ ...prev, createdDate: range }));
  };
  const updateCreatedDateStaticRangeFilter = (value: FilterTime) => {
    const range = getMinMaxOfListTime(
      supplierList.map((row) => row.createdDate)
    );
    const rangeTime = getStaticRangeFilterTime(
      value,
      range.minDate,
      range.maxDate
    );
    setRangeTimeFilter((prev) => ({ ...prev, createdDate: rangeTime }));
  };
  const updateStatusMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, status: values }));
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

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <SearchFilter
        key={1}
        choices={Array.from(
          new Set(supplierList.map((row) => row.supplierGroup))
        )}
        chosenValues={multiFilter.supplierGroup}
        title="Supplier Group"
        placeholder="Select group"
        onValuesChanged={updateSupplierGroupMultiFilter}
      />
      <TimeFilter
        key={2}
        title="Date Modified"
        singleTimeValue={singleFilter.createdDate}
        rangeTimeValue={rangeTimeFilter.createdDate}
        onRangeTimeFilterChanged={updateCreatedDateRangeTimeFilter}
        onSingleTimeFilterChanged={updateCreatedDateStaticRangeFilter}
      />
      <RangeFilter
        key={3}
        range={rangeNumFilter.sale}
        title="Sale"
        onValuesChanged={updateSaleRangeNumFilter}
      />
      <RangeFilter
        key={4}
        range={rangeNumFilter.debt}
        title="Debt"
        onValuesChanged={updateDebtRangeNumFilter}
      />
      <ChoicesFilter
        key={5}
        title="Status"
        choices={Object.values(Status)}
        isSingleChoice={false}
        defaultValues={multiFilter.status}
        onMultiChoicesChanged={updateStatusMultiFilter}
      />
    </div>,
  ];
  const headerButtons = [<Button key={0}>More+</Button>];
  return (
    <PageWithFilters
      title="Supplier"
      filters={filters}
      headerButtons={headerButtons}
    >
      <DataTable data={filteredSupplierList} onSubmit={handleFormSubmit} />
    </PageWithFilters>
  );
}
