"use client";

import { Button } from "@/components/ui/button";
import {
  ChoicesFilter,
  FilterTime,
  FilterYear,
  PageWithFilters,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";
import { Invoice } from "@/entities/Invoice";
import { TransactionType } from "@/entities/Transaction";
import { TimeFilterType, formatID, handleTimeFilter } from "@/utils";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";

const originalInvoiceList: Invoice[] = [];
// for (let i = 0; i < 500; i++) {
//   originalInvoiceList.push({
//     id: i,
//     discount: 80000,
//     subTotal: 300000,
//     total: 300000 - 10000 - 80000,
//     changed: 40000,
//     transactionType: TransactionType.CASH,
//     createdDate: new Date(new Date().setDate(i - 400)),
//     creator: "NGUYEN VAN A",
//     VAT: 10000,
//   });
// }

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
        // newRow.id = formatID(newRow.id, "HD");
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

  const [filterChoices, setFilterChocies] = useState<{
    status: string[];
    creator: string[];
    seller: string[];
    paymentMethod: string[];
    priceTable: string[];
  }>({
    status: ["Pending", "Done"],
    creator: [],
    seller: [],
    paymentMethod: [],
    priceTable: [],
  });

  const updateStatusFilterChoices = (choices: string[]) => {
    setFilterChocies((prev) => ({
      ...prev,
      status: choices,
    }));
  };

  const updateCreatorFilterChoices = (choices: string[]) => {
    setFilterChocies((prev) => ({
      ...prev,
      creator: choices,
    }));
  };

  const updateSellerFilterChoices = (choices: string[]) => {
    setFilterChocies((prev) => ({
      ...prev,
      seller: choices,
    }));
  };

  const updatePaymentMethodFilterChoices = (choices: string[]) => {
    setFilterChocies((prev) => ({
      ...prev,
      paymentMethod: choices,
    }));
  };

  const updatePriceTableFilterChoices = (choices: string[]) => {
    setFilterChocies((prev) => ({
      ...prev,
      priceTable: choices,
    }));
  };

  const filters = [
    <TimeFilter
      key={1}
      title="Created Date"
      timeFilterControl={timeFilterControl.createdDate}
      singleTimeValue={staticRangeFilter.createdDate}
      rangeTimeValue={rangeTimeFilter.createdDate}
      onTimeFilterControlChanged={updateCreatedDateFilterControl}
      onRangeTimeFilterChanged={updateCreatedDateRangeTimeFilter}
      onSingleTimeFilterChanged={updateCreatedDateStaticRangeTimeFilter}
      className="mb-4"
    />,
    <ChoicesFilter
      key={2}
      title="Status"
      isSingleChoice={false}
      choices={["Pending", "Done", "Cancelled"]}
      defaultValues={filterChoices.status}
      onMultiChoicesChanged={updateStatusFilterChoices}
      className="my-4"
    />,
    <SearchFilter
      key={3}
      title="Creator"
      placeholder="Find creator..."
      choices={["Nam", "Khoi", "Son", "Dat"]}
      chosenValues={filterChoices.creator}
      onValuesChanged={updateCreatorFilterChoices}
      className="my-4"
    />,
    <SearchFilter
      key={4}
      title="Seller"
      placeholder="Find seller..."
      choices={["Nam", "Khoi", "Son", "Dat"]}
      chosenValues={filterChoices.seller}
      onValuesChanged={updateSellerFilterChoices}
      className="my-4"
    />,
    <ChoicesFilter
      key={5}
      title="Payment method"
      isSingleChoice={false}
      choices={["By Cash", "VISA Card", "Bank transfer"]}
      defaultValues={filterChoices.paymentMethod}
      onMultiChoicesChanged={updatePaymentMethodFilterChoices}
      className="my-4"
    />,
    <SearchFilter
      key={6}
      title="Price table"
      placeholder="Find price table..."
      choices={["General table", "Black Friday", "X", "D"]}
      chosenValues={filterChoices.priceTable}
      onValuesChanged={updatePriceTableFilterChoices}
      className="my-4"
    />,
  ];

  return (
    <PageWithFilters title="Invoice" filters={filters}>
      <DataTable data={filteredInvoiceList}></DataTable>
    </PageWithFilters>
  );
}
