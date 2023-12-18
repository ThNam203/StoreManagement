"use client";
import {
  ChoicesFilter,
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

const creatorChoices = ["Nam", "Dat", "Son", "Khoi"];

export default function StockCheck() {
  const [filtersChoice, setFiltersChoice] = useState<{
    time: {
      timeFilterType: TimeFilterType;
      singleTime: FilterTime;
      rangeTime: {
        startDate: Date;
        endDate: Date;
      };
    };
    status: string[];
    creator: string[];
  }>({
    time: {
      timeFilterType: TimeFilterType.StaticRange,
      singleTime: FilterYear.AllTime,
      rangeTime: {
        startDate: new Date(),
        endDate: new Date(),
      },
    },
    status: ["Pending", "Done balanced"],
    creator: [],
  });

  const updateSingleTimeFilter = (choice: FilterTime) =>
    setFiltersChoice((prev) => ({
      ...prev,
      time: {
        timeFilterType: TimeFilterType.StaticRange,
        singleTime: choice,
        rangeTime: prev.time.rangeTime,
      },
    }));

  const updateRangeTimeFilter = (choice: { startDate: Date; endDate: Date }) =>
    setFiltersChoice((prev) => ({
      ...prev,
      time: {
        timeFilterType: TimeFilterType.RangeTime,
        singleTime: prev.time.singleTime,
        rangeTime: choice,
      },
    }));

  const updateTimeFilterType = (choice: TimeFilterType) =>
    setFiltersChoice((prev) => ({
      ...prev,
      time: { ...prev.time, timeFilterType: choice },
    }));

  const updateCreatorFilter = (choices: string[]) => {
    setFiltersChoice((prev) => ({
      ...prev,
      creator: choices,
    }));
  };

  const updateStatusFilter = (choices: string[]) => {
    setFiltersChoice((prev) => ({
      ...prev,
      status: choices,
    }));
  };

  const filters = [
    <TimeFilter
      key={1}
      title="Price tables"
      timeFilterControl={filtersChoice.time.timeFilterType}
      singleTimeValue={filtersChoice.time.singleTime}
      rangeTimeValue={filtersChoice.time.rangeTime}
      onTimeFilterControlChanged={updateTimeFilterType}
      onSingleTimeFilterChanged={updateSingleTimeFilter}
      onRangeTimeFilterChanged={updateRangeTimeFilter}
      className="mb-4"
    />,
    <ChoicesFilter
      key={2}
      title="Status"
      defaultValues={filtersChoice.status}
      choices={["Pending", "Done balanced", "Cancelled"]}
      isSingleChoice={false}
      onMultiChoicesChanged={updateStatusFilter}
      className="my-4"
    />,
    <SearchFilter
      key={3}
      placeholder="Find creator..."
      title="Creator"
      chosenValues={filtersChoice.creator}
      choices={creatorChoices}
      onValuesChanged={updateCreatorFilter}
      className="my-4"
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
