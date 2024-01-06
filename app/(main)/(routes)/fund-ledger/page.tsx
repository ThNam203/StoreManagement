"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./datatable";

import {
  FilterTime,
  FilterWeek,
  MultiChoicesFilter,
  PageWithFilters,
  RangeFilter,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";
import { useToast } from "@/components/ui/use-toast";
import {
  FormType,
  Status,
  TargetType,
  Transaction,
  TransactionType,
} from "@/entities/Transaction";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { setStaffs } from "@/reducers/staffReducer";
import {
  addTransaction,
  addTransactions,
  setTransactions,
  updateTransaction,
} from "@/reducers/transactionReducer";
import { setStrangers } from "@/reducers/transactionStrangerReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import StaffService from "@/services/staff_service";
import TransactionService from "@/services/transaction_service";
import {
  TimeFilterType,
  handleMultipleFilter,
  handleRangeNumFilter,
  handleTimeFilter,
} from "@/utils";
import { convertStaffReceived } from "@/utils/staffApiUtils";
import {
  convertExpenseFormReceived,
  convertExpenseFormToSent,
  convertReceiptFormReceived,
  convertReceiptFormToSent,
  convertStrangerReceived,
} from "@/utils/transactionApiUtils";
import { useRouter } from "next/navigation";
import CustomerService from "@/services/customerService";
import { setCustomers } from "@/reducers/customersReducer";
import SupplierService from "@/services/supplierService";
import { setSuppliers } from "@/reducers/suppliersReducer";
import Image from "next/image";

export default function FundLedger() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const transactionList = useAppSelector((state) => state.transactions.value);
  const [filteredTransactionList, setFilteredTransactionList] = useState<
    Transaction[]
  >([]);
  const [multiFilter, setMultiFilter] = useState({
    transactionType: [] as string[],
    formType: [] as string[],
    status: [] as string[],
    creator: [] as string[],
    targetType: [] as string[],
    targetName: [] as string[],
  });
  const [staticRangeFilter, setStaticRangeFilter] = useState({
    time: FilterWeek.Last7Days as FilterTime,
  });
  const [rangeTimeFilter, setRangeTimeFilter] = useState({
    time: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });
  const [rangeNumFilter, setRangeNumFilter] = useState({
    value: {
      startValue: NaN,
      endValue: NaN,
    },
  });
  const [timeFilterControl, setTimeFilterControl] = useState({
    time: TimeFilterType.StaticRange as TimeFilterType,
  });

  // hook use effect
  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      try {
        const resExpenseForm = await TransactionService.getAllExpenseForms();
        const expenseList = resExpenseForm.data.map((form) =>
          convertExpenseFormReceived(form),
        );
        dispatch(setTransactions(expenseList));

        const resReceiptForm = await TransactionService.getAllReceiptForms();
        const receiptList = resReceiptForm.data.map((form) =>
          convertReceiptFormReceived(form),
        );
        dispatch(addTransactions(receiptList));

        const resStaff = await StaffService.getAllStaffs();
        dispatch(
          setStaffs(
            resStaff.data.filter((staff) => staff.position !== "Owner"),
          ),
        );

        const resStranger = await TransactionService.getAllStrangers();
        dispatch(setStrangers(resStranger.data));

        const customers = await CustomerService.getAllCustomers();
        dispatch(setCustomers(customers.data));

        const suppliers = await SupplierService.getAllSuppliers();
        dispatch(setSuppliers(suppliers.data));
      } catch (e) {
        axiosUIErrorHandler(e, toast, router);
      } finally {
        dispatch(disablePreloader());
      }
    };

    fetchData();
  }, []);

  const addExpenseForm = async (value: Transaction) => {
    console.log("add expense form");
    try {
      const convertedToSent = convertExpenseFormToSent(value);
      const res =
        await TransactionService.createNewExpenseForm(convertedToSent);
      const expense = convertExpenseFormReceived(res.data);
      dispatch(addTransaction(expense));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  };

  const addReceiptForm = async (value: Transaction) => {
    try {
      const convertedToSent = convertReceiptFormToSent(value);
      const res =
        await TransactionService.createNewReceiptForm(convertedToSent);
      const receipt = convertReceiptFormReceived(res.data);
      dispatch(addTransaction(receipt));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  };

  const updateExpenseForm = async (value: Transaction) => {
    try {
      const convertedToSent = convertExpenseFormToSent(value);
      const res = await TransactionService.updateExpenseForm(
        convertedToSent.id,
        convertedToSent,
      );
      const expense = convertExpenseFormReceived(res.data);
      console.log("updated expense", expense);
      dispatch(updateTransaction(expense));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  };

  const updateReceiptForm = async (value: Transaction) => {
    try {
      const convertedToSent = convertReceiptFormToSent(value);
      const res = await TransactionService.updateReceiptForm(
        convertedToSent.id,
        convertedToSent,
      );
      const receipt = convertReceiptFormReceived(res.data);
      console.log("updated receipt", receipt);
      dispatch(updateTransaction(receipt));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  };

  useEffect(() => {
    let filteredList = [...transactionList];
    filteredList = handleMultipleFilter<Transaction>(multiFilter, filteredList);
    filteredList = handleTimeFilter<Transaction>(
      staticRangeFilter,
      rangeTimeFilter,
      timeFilterControl,
      filteredList,
    );
    filteredList = handleRangeNumFilter<Transaction>(
      rangeNumFilter,
      filteredList,
    );
    setFilteredTransactionList([...filteredList]);
  }, [
    multiFilter,
    staticRangeFilter,
    rangeTimeFilter,
    timeFilterControl,
    transactionList,
    rangeNumFilter,
  ]);

  //function
  function handleFormSubmit(value: Transaction) {
    if (value.id === -1) {
      if (value.formType === FormType.EXPENSE)
        return addExpenseForm(value).then(() => {
          toast({
            variant: "default",
            title: "Add expense form successfully",
          });
        });
      return addReceiptForm(value).then(() => {
        toast({
          variant: "default",
          title: "Add receipt form successfully",
        });
      });
    } else {
      if (value.formType === FormType.EXPENSE)
        return updateExpenseForm(value).then(() => {
          toast({
            variant: "default",
            title: "Update expense form successfully",
          });
        });
      return updateReceiptForm(value).then(() => {
        toast({
          variant: "default",
          title: "Update receipt form successfully",
        });
      });
    }
  }

  const updateTimeRangeTimeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeTimeFilter((prev) => ({ ...prev, time: range }));
  };

  const updateTimeStaticRangeTimeFilter = (value: FilterTime) => {
    setStaticRangeFilter((prev) => ({ ...prev, time: value }));
  };
  const updateTimeFilterControl = (timeFilterControl: TimeFilterType) => {
    setTimeFilterControl((prev) => ({
      ...prev,
      time: timeFilterControl,
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
  const updateValueRangeNumFilter = (range: {
    startValue: number;
    endValue: number;
  }) => {
    setRangeNumFilter((prev) => ({ ...prev, value: range }));
  };

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <TimeFilter
        key={1}
        title="Time"
        timeFilterControl={timeFilterControl.time}
        rangeTimeValue={rangeTimeFilter.time}
        singleTimeValue={staticRangeFilter.time}
        onTimeFilterControlChanged={updateTimeFilterControl}
        onRangeTimeFilterChanged={updateTimeRangeTimeFilter}
        onSingleTimeFilterChanged={updateTimeStaticRangeTimeFilter}
      />
      <SearchFilter
        key={5}
        choices={Array.from(new Set(transactionList.map((row) => row.creator)))}
        chosenValues={multiFilter.creator}
        title="Creator"
        placeholder="Select creator"
        onValuesChanged={updateCreatorMultiFilter}
      />
      <MultiChoicesFilter
        key={2}
        title="Transaction type"
        choices={Object.values(TransactionType)}
        values={multiFilter.transactionType}
        onValueChanged={updateTransactionTypeMultiFilter}
      />
      <SearchFilter
        key={7}
        title="Receiver/Payer"
        chosenValues={multiFilter.targetName}
        choices={Array.from(
          new Set(transactionList.map((row) => row.targetName)),
        )}
        placeholder="Select reveiver/payer"
        alwaysOpen
        onValuesChanged={updateTargetNameMultiFilter}
      />
      <MultiChoicesFilter
        key={4}
        title="Status"
        choices={Object.values(Status)}
        values={multiFilter.status}
        onValueChanged={updateStatusMultiFilter}
      />
      <RangeFilter
        title="Value"
        range={rangeNumFilter.value}
        onValuesChanged={updateValueRangeNumFilter}
      />
      <MultiChoicesFilter
        key={3}
        title="Form type"
        choices={Object.values(FormType)}
        values={multiFilter.formType}
        onValueChanged={updateFormTypeMultiFilter}
      />

      <MultiChoicesFilter
        key={6}
        title="Receiver/Payer type"
        choices={Object.values(TargetType)}
        values={multiFilter.targetType}
        onValueChanged={updateTargetTypeMultiFilter}
      />
    </div>,
  ];

  return (
    <PageWithFilters title="Fund Ledger" filters={filters}>
      <DataTable data={filteredTransactionList} onSubmit={handleFormSubmit} />
    </PageWithFilters>
  );
}
