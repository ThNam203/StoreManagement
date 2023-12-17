"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./datatable";

import { Button } from "@/components/ui/button";
import {
  ChoicesFilter,
  FilterTime,
  FilterWeek,
  FilterYear,
  PageWithFilters,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";
import {
  FormType,
  Status,
  TargetType,
  Transaction,
  TransactionType,
} from "@/entities/Transaction";
import {
  TimeFilterType,
  formatID,
  getMinMaxOfListTime,
  getStaticRangeFilterTime,
  handleMultipleFilter,
  handleRangeTimeFilter,
  handleTimeFilter,
} from "@/utils";
import { Toaster } from "@/components/ui/toaster";
import { useAppDispatch } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import StaffService from "@/services/staff_service";
import { convertStaffReceived } from "@/utils/staffApiUtils";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { setStaffs } from "@/reducers/staffReducer";
import { useToast } from "@/components/ui/use-toast";
const originalSalesList: Transaction[] = [
  {
    id: 1,
    targetType: TargetType.CUSTOMER,
    targetName: "David",
    formType: FormType.RECEIPT,
    description: "Receive from Customer",
    transactionType: TransactionType.CASH,
    value: 100000,
    creator: "NGUYEN VAN A",
    createdDate: new Date(),
    status: Status.PAID,
    note: "",
  },
  {
    id: 2,
    targetType: TargetType.CUSTOMER,
    targetName: "Henry",
    formType: FormType.RECEIPT,
    description: "Receive from Customer",
    transactionType: TransactionType.TRANSFER,
    value: 200000,
    creator: "NGUYEN VAN B",
    createdDate: new Date(),
    status: Status.CANCELLED,
    note: "",
  },
  {
    id: 3,
    targetType: TargetType.SUPPLIER,
    targetName: "Mary",
    formType: FormType.EXPENSE,
    description: "Pay for Supplier",
    transactionType: TransactionType.TRANSFER,
    value: 20000000,
    creator: "NGUYEN VAN C",
    createdDate: new Date(),
    status: Status.PAID,
    note: "",
  },
];

export default function SalesPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [salesList, setSalesList] = useState<Transaction[]>([]);
  const [filteredSaleList, setFilterSaleList] = useState<Transaction[]>([]);
  const [multiFilter, setMultiFilter] = useState({
    transactionType: [] as string[],
    formType: [] as string[],
    status: [] as string[],
    creator: [] as string[],
    targetType: [] as string[],
    targetName: [] as string[],
  });
  const [staticRangeFilter, setStaticRangeFilter] = useState({
    createdDate: FilterWeek.Last7Days as FilterTime,
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
    dispatch(showPreloader());
    const fetchData = async () => {
      try {
        setSalesList(originalSalesList);

        const res = await StaffService.getAllStaffs();
        const staffReceived = res.data.map((staff) =>
          convertStaffReceived(staff),
        );
        dispatch(setStaffs(staffReceived));
      } catch (e) {
        axiosUIErrorHandler(e, toast);
      } finally {
        dispatch(disablePreloader());
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredList = [...salesList];
    filteredList = handleMultipleFilter<Transaction>(multiFilter, filteredList);
    filteredList = handleTimeFilter<Transaction>(
      staticRangeFilter,
      rangeTimeFilter,
      timeFilterControl,
      filteredList,
    );

    setFilterSaleList([...filteredList]);
  }, [
    multiFilter,
    staticRangeFilter,
    rangeTimeFilter,
    timeFilterControl,
    salesList,
  ]);

  //function
  function handleFormSubmit(values: Transaction) {
    setSalesList((prev) => [...prev, values]);
  }

  const updateCreatedDateRangeTimeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeTimeFilter((prev) => ({ ...prev, createdDate: range }));
  };

  const updateCreatedDateStaticRangeTimeFilter = (value: FilterTime) => {
    setStaticRangeFilter((prev) => ({ ...prev, createdDate: value }));
  };
  const updateCreatedDateFilterControl = (
    timeFilterControl: TimeFilterType,
  ) => {
    setTimeFilterControl((prev) => ({
      ...prev,
      createdDate: timeFilterControl,
    }));
  };
  const updateTransactionTypeMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, transactionType: values }));
  };
  const updateFormTypeMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, formType: values }));
  };
  const updateStatusMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, status: values }));
  };
  const updateCreatorMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, creator: values }));
  };
  const updateTargetTypeMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, targetType: values }));
  };
  const updateTargetNameMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, targetName: values }));
  };

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <TimeFilter
        key={1}
        title="Date Modified"
        timeFilterControl={timeFilterControl.createdDate}
        rangeTimeValue={rangeTimeFilter.createdDate}
        singleTimeValue={staticRangeFilter.createdDate}
        onTimeFilterControlChanged={updateCreatedDateFilterControl}
        onRangeTimeFilterChanged={updateCreatedDateRangeTimeFilter}
        onSingleTimeFilterChanged={updateCreatedDateStaticRangeTimeFilter}
      />
      <ChoicesFilter
        key={2}
        title="Transaction Type"
        choices={Object.values(TransactionType)}
        isSingleChoice={false}
        defaultValues={multiFilter.transactionType}
        onMultiChoicesChanged={updateTransactionTypeMultiFilter}
      />

      <ChoicesFilter
        key={3}
        title="Form Type"
        choices={Object.values(FormType)}
        isSingleChoice={false}
        defaultValues={multiFilter.formType}
        onMultiChoicesChanged={updateFormTypeMultiFilter}
      />

      <ChoicesFilter
        key={4}
        title="Status"
        choices={Object.values(Status)}
        isSingleChoice={false}
        defaultValues={multiFilter.status}
        onMultiChoicesChanged={updateStatusMultiFilter}
      />

      <SearchFilter
        key={5}
        choices={Array.from(new Set(salesList.map((row) => row.creator)))}
        chosenValues={multiFilter.creator}
        title="Creator"
        placeholder="Select creator"
        onValuesChanged={updateCreatorMultiFilter}
      />

      <ChoicesFilter
        key={6}
        title="Receiver/Payer Type"
        choices={Object.values(TargetType)}
        isSingleChoice={false}
        defaultValues={multiFilter.targetType}
        onMultiChoicesChanged={updateTargetTypeMultiFilter}
      />

      <SearchFilter
        key={7}
        title="Receiver/Payer"
        chosenValues={multiFilter.targetName}
        choices={Array.from(new Set(salesList.map((row) => row.targetName)))}
        placeholder="Select reveiver/payer"
        alwaysOpen
        onValuesChanged={updateTargetNameMultiFilter}
      />
    </div>,
  ];

  return (
    <PageWithFilters title="Fund Ledger" filters={filters}>
      <DataTable data={filteredSaleList} onSubmit={handleFormSubmit} />
    </PageWithFilters>
  );
}
