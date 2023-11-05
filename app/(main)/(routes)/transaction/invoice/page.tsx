"use client";

import { Button } from "@/components/ui/button";
import {
  FilterTime,
  FilterYear,
  PageWithFilters,
  TimeFilter,
} from "@/components/ui/filter";
import { DiscountType, Invoice } from "@/entities/Invoice";
import { TransactionType } from "@/entities/Transaction";
import { TimeFilterType, formatID, handleTimeFilter } from "@/utils";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";

const originalInvoiceList: Invoice[] = [];
for (let i = 0; i < 500; i++) {
  originalInvoiceList.push({
    id: i,
    discountType: DiscountType.MONEY,
    discount: 80000,
    subTotal: 300000,
    total: 300000 - 10000 - 80000,
    moneyGiven: 250000,
    change: 40000,
    transactionType: TransactionType.CASH,
    createdDate: new Date(new Date().setDate(i - 400)),
    creator: "NGUYEN VAN A",
    VAT: 10000,
  });
}

export default function InvoicePage() {
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
  const [filteredInvoiceList, setFilteredInvoiceList] = useState<Invoice[]>([]);
  const [staticRangeFilter, setStaticRangeFilter] = useState({
    createdDate: FilterYear.AllTime as FilterTime,
  });
  const [rangeTimeFilter, setRangeTimeFilter] = useState({
    createdDate: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });
  const [timeFilterControl, setTimeFilterControl] = useState({
    createdDate: TimeFilterType.StaticRange as TimeFilterType,
  });

  // hook use effect
  useEffect(() => {
    const fetchData = async () => {
      const res = originalInvoiceList;
      const formatedData: Invoice[] = res.map((row) => {
        const newRow = { ...row };
        newRow.id = formatID(newRow.id, "HD");
        return newRow;
      });
      setInvoiceList(formatedData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filteredList = [...invoiceList];
    filteredList = handleTimeFilter<Invoice>(
      staticRangeFilter,
      rangeTimeFilter,
      timeFilterControl,
      filteredList
    );

    setFilteredInvoiceList([...filteredList]);
  }, [rangeTimeFilter, staticRangeFilter, timeFilterControl, invoiceList]);

  const updateCreatedDateRangeTimeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeTimeFilter((prev) => ({ ...prev, createdDate: range }));
  };

  const updateCreatedDateStaticRangeTimeFilter = (value: FilterTime) => {
    setStaticRangeFilter((prev) => ({ ...prev, createdDate: value }));
  };

  const updateCreatedDateFilterControl = (value: TimeFilterType) => {
    setTimeFilterControl((prev) => ({ ...prev, createdDate: value }));
  };

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <TimeFilter
        key={1}
        title="Date Modified"
        timeFilterControl={timeFilterControl.createdDate}
        singleTimeValue={staticRangeFilter.createdDate}
        rangeTimeValue={rangeTimeFilter.createdDate}
        onTimeFilterControlChanged={updateCreatedDateFilterControl}
        onRangeTimeFilterChanged={updateCreatedDateRangeTimeFilter}
        onSingleTimeFilterChanged={updateCreatedDateStaticRangeTimeFilter}
      />
    </div>,
  ];
  const headerButtons = [<Button key={1}>More+</Button>];
  return (
    <PageWithFilters
      title="Invoice"
      filters={filters}
      headerButtons={headerButtons}
    >
      <DataTable data={filteredInvoiceList}></DataTable>
    </PageWithFilters>
  );
}
