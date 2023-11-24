"use client";

import { Button } from "@/components/ui/button";
import {
  FilterTime,
  FilterYear,
  PageWithFilters,
  TimeFilter,
} from "@/components/ui/filter";
import { ImportForm, Status } from "@/entities/ImportForm";
import { TimeFilterType, formatID, handleTimeFilter } from "@/utils";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";

const originalImportFormList: ImportForm[] = [];
for (let i = 0; i < 500; i++) {
  originalImportFormList.push({
    id: i,
    createdDate: new Date(new Date().setDate(i - 400)),
    updatedDate: new Date(new Date().setDate(i - 400 + 1)),
    supplier: "Nha cung cap banh gao AOne",
    branch: "Center",
    creator: "Nguyen Van A",
    quantity: i,
    itemQuantity: i,
    subTotal: 1000000,
    discountType: "Money",
    discount: 100000,
    total: 1000000 - 100000,
    moneyGiven: 1000000,
    change: 100000,
    note: "",
    status: Status.IMPORTED,
  });
}

export default function ImportFormPage() {
  const [importFormList, setImportFormList] = useState<ImportForm[]>([]);
  const [filteredImportFormList, setFilteredImportFormList] = useState<
    ImportForm[]
  >([]);

  const [staticRangeFilter, setStaticRangeFilter] = useState({
    createdDate: FilterYear.AllTime as FilterTime,
    updatedDate: FilterYear.AllTime as FilterTime,
  });
  const [rangeTimeFilter, setRangeTimeFilter] = useState({
    createdDate: {
      startDate: new Date(),
      endDate: new Date(),
    },
    updatedDate: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const [timeFilterControl, setTimeFilterControl] = useState({
    createdDate: TimeFilterType.StaticRange as TimeFilterType,
    updatedDate: TimeFilterType.StaticRange as TimeFilterType,
  });

  // hook use effect
  useEffect(() => {
    const fetchData = async () => {
      const res = originalImportFormList;
      const formatedData: ImportForm[] = res.map((row) => {
        const newRow = { ...row };
        newRow.id = formatID(newRow.id, "NH");
        return newRow;
      });
      setImportFormList(formatedData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredImportFormList({ ...importFormList });
    let filteredList = [...importFormList];
    filteredList = handleTimeFilter<ImportForm>(
      staticRangeFilter,
      rangeTimeFilter,
      timeFilterControl,
      filteredList
    );
    setFilteredImportFormList([...filteredList]);
  }, [rangeTimeFilter, staticRangeFilter, timeFilterControl, importFormList]);

  const updateCreatedDateRangeTimeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeTimeFilter((prev) => ({ ...prev, createdDate: range }));
  };
  const updateUpdatedDateRangeTimeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeTimeFilter((prev) => ({ ...prev, updatedDate: range }));
  };

  const updateCreatedDateStaticRangeTimeFilter = (value: FilterTime) => {
    setStaticRangeFilter((prev) => ({ ...prev, createdDate: value }));
  };
  const updateUpdatedDateStaticRangeTimeFilter = (value: FilterTime) => {
    setStaticRangeFilter((prev) => ({ ...prev, updatedDate: value }));
  };

  const updateCreatedDateFilterControl = (value: TimeFilterType) => {
    setTimeFilterControl((prev) => ({ ...prev, createdDate: value }));
  };
  const updateUpdatedDateFilterControl = (value: TimeFilterType) => {
    setTimeFilterControl((prev) => ({ ...prev, updatedDate: value }));
  };

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <TimeFilter
        key={1}
        title="Date Created"
        timeFilterControl={timeFilterControl.createdDate}
        singleTimeValue={staticRangeFilter.createdDate}
        rangeTimeValue={rangeTimeFilter.createdDate}
        onTimeFilterControlChanged={updateCreatedDateFilterControl}
        onRangeTimeFilterChanged={updateCreatedDateRangeTimeFilter}
        onSingleTimeFilterChanged={updateCreatedDateStaticRangeTimeFilter}
      />
      <TimeFilter
        key={2}
        title="Date Updated"
        timeFilterControl={timeFilterControl.updatedDate}
        singleTimeValue={staticRangeFilter.updatedDate}
        rangeTimeValue={rangeTimeFilter.updatedDate}
        onTimeFilterControlChanged={updateUpdatedDateFilterControl}
        onRangeTimeFilterChanged={updateUpdatedDateRangeTimeFilter}
        onSingleTimeFilterChanged={updateUpdatedDateStaticRangeTimeFilter}
      />
    </div>,
  ];

  return (
    <PageWithFilters
      title="Import Form"
      filters={filters}
    >
      <DataTable data={filteredImportFormList}></DataTable>
    </PageWithFilters>
  );
}
