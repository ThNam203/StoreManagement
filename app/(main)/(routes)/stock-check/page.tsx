"use client";
import {
  FilterTime,
  FilterYear,
  PageWithFilters,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";
import { useEffect, useState } from "react";
import { StockCheckDatatable } from "./datatable";
import { TimeFilterType } from "@/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import StockCheckService from "@/services/stock_check_service";
import { setStockChecks } from "@/reducers/stockChecksReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useToast } from "@/components/ui/use-toast";

export default function StockCheck() {
  const [filterConditions, setFilterConditions] = useState<{
    createdDate: {
      timeFilterType: TimeFilterType;
      singleTime: FilterTime;
      rangeTime: {
        startDate: Date;
        endDate: Date;
      };
    };
  }>({
    createdDate: {
      timeFilterType: TimeFilterType.StaticRange,
      singleTime: FilterYear.AllTime,
      rangeTime: {
        startDate: new Date(),
        endDate: new Date(),
      },
    },
  });

  const updateCreatedDateCondition = (choice: FilterTime) =>
    setFilterConditions((prev) => ({
      ...prev,
      createdDate: {
        ...prev.createdDate,
        singleTime: choice,
      },
    }));
    
  const updateCreatedDateRangeCondition = (choice: {startDate: Date, endDate: Date}) =>
    setFilterConditions((prev) => ({
      ...prev,
      createdDate: {
        ...prev.createdDate,
        rangeTime: choice,
      },
    }));
    
    const updateCreatedDateControlCondition = (choice: TimeFilterType) =>
    setFilterConditions((prev) => ({
      ...prev,
      createdDate: {
        ...prev.createdDate,
        timeFilterType: choice,
      },
    }));

  // const updateCreatorFilter = (choices: string[]) => {
  //   setFiltersChoice((prev) => ({
  //     ...prev,
  //     creator: choices,
  //   }));
  // };

  // const updateStatusFilter = (choices: string[]) => {
  //   setFiltersChoice((prev) => ({
  //     ...prev,
  //     status: choices,
  //   }));
  // };

  const filters = [
    <TimeFilter
      key={1}
      title="Created Date"
      timeFilterControl={filterConditions.createdDate.timeFilterType}
      singleTimeValue={filterConditions.createdDate.singleTime}
      rangeTimeValue={filterConditions.createdDate.rangeTime}
      onTimeFilterControlChanged={updateCreatedDateControlCondition}
      onSingleTimeFilterChanged={updateCreatedDateCondition}
      onRangeTimeFilterChanged={updateCreatedDateRangeCondition}
      className="mb-4"
    />,
  ];

  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const stockChecks = useAppSelector((state) => state.stockChecks.value);

  useEffect(() => {
    dispatch(showPreloader())
    const fetchData = async () => {
      const stockChecks = await StockCheckService.getAllStockChecks()
      dispatch(setStockChecks(stockChecks))
    }

    fetchData().then().catch(e => axiosUIErrorHandler(e, toast)).finally(() => dispatch(disablePreloader()))
  }, [])

  return (
    <PageWithFilters
      title="Stock check"
      filters={filters}
      headerButtons={[
        <Button key={1} variant={"green"} onClick={() => router.push("/stock-check/new")}>
          New stock check
        </Button>,
      ]}
    >
      <StockCheckDatatable data={stockChecks} />
    </PageWithFilters>
  );
}
