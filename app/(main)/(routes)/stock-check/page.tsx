"use client";
import { Button } from "@/components/ui/button";
import {
  FilterTime,
  FilterYear,
  PageWithFilters,
  RangeFilter,
  TimeFilter,
} from "@/components/ui/filter";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { setStockChecks } from "@/reducers/stockChecksReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import StockCheckService from "@/services/stockCheckService";
import {
  TimeFilterType,
  handleDateCondition,
  handleRangeNumFilter,
  handleTimeFilter,
} from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StockCheckDatatable } from "./datatable";
import StaffService from "@/services/staff_service";
import { setStaffs } from "@/reducers/staffReducer";

export default function StockCheck() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const stockChecks = useAppSelector((state) => state.stockChecks.value);
  const roles = useAppSelector((state) => state.role.value);
  const profile = useAppSelector((state) => state.profile.value)!;
  const userPermissions = roles?.find(
    (role) => role.positionName === profile?.position,
  )!.roleSetting;

  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const stockChecks = await StockCheckService.getAllStockChecks();
      dispatch(setStockChecks(stockChecks));

      const staffs = await StaffService.getAllStaffs();
      dispatch(setStaffs(staffs.data));
    };

    fetchData()
      .then()
      .catch((e) => axiosUIErrorHandler(e, toast, router))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  const [filteredStockChecks, setFilteredStockChecks] = useState(stockChecks);

  const [timeConditionControls, setTimeConditionControls] = useState({
    createdDate: TimeFilterType.StaticRange as TimeFilterType,
  });
  const [timeConditions, setTimeConditions] = useState({
    createdDate: FilterYear.AllTime as FilterTime,
  });
  const [timeRangeConditions, setTimeRangeConditions] = useState({
    createdDate: { startDate: new Date(), endDate: new Date() },
  });
  const [rangeConditions, setRangeConditions] = useState({
    totalStock: {
      startValue: NaN,
      endValue: NaN,
    },
    totalCountedStock: {
      startValue: NaN,
      endValue: NaN,
    },
    totalValue: {
      startValue: NaN,
      endValue: NaN,
    },
    stockDifference: {
      startValue: NaN,
      endValue: NaN,
    },
    totalValueDifference: {
      startValue: NaN,
      endValue: NaN,
    },
  });

  const updateTotalValueRangeCondition = (condition: {
    startValue: number;
    endValue: number;
  }) => {
    setRangeConditions((prev) => ({
      ...prev,
      totalValue: condition,
    }));
  };

  const updateTotalStockRangeCondition = (condition: {
    startValue: number;
    endValue: number;
  }) => {
    setRangeConditions((prev) => ({
      ...prev,
      totalStock: condition,
    }));
  };

  const updateStockDifferenceRangeCondition = (condition: {
    startValue: number;
    endValue: number;
  }) => {
    setRangeConditions((prev) => ({
      ...prev,
      stockDifference: condition,
    }));
  };

  const updateTotalValueDifferenceRangeCondition = (condition: {
    startValue: number;
    endValue: number;
  }) => {
    setRangeConditions((prev) => ({
      ...prev,
      totalValueDifference: condition,
    }));
  };

  const updateTotalCountedStockRangeCondition = (condition: {
    startValue: number;
    endValue: number;
  }) => {
    setRangeConditions((prev) => ({
      ...prev,
      totalCountedStock: condition,
    }));
  };

  const updateCreatedDateConditionControl = (control: TimeFilterType) => {
    setTimeConditionControls((prev) => ({
      createdDate: control,
    }));
  };

  const updateCreatedDateCondition = (condition: FilterTime) => {
    setTimeConditions((prev) => ({
      createdDate: condition,
    }));
  };

  const updateCreatedDateConditionRange = (condition: {
    startDate: Date;
    endDate: Date;
  }) => {
    setTimeRangeConditions((prev) => ({
      createdDate: condition,
    }));
  };

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

  useEffect(() => {
    let filteredStockChecks = stockChecks;
    filteredStockChecks = handleTimeFilter(
      timeConditions,
      timeRangeConditions,
      timeConditionControls,
      filteredStockChecks,
    );
    filteredStockChecks = handleRangeNumFilter(
      rangeConditions,
      filteredStockChecks,
    );
    filteredStockChecks = filteredStockChecks.filter((stockCheck) => {
      if (
        !handleDateCondition(
          timeConditions.createdDate,
          timeRangeConditions.createdDate,
          timeConditionControls.createdDate,
          new Date(stockCheck.createdDate),
        )
      )
        return false;

      return true;
    });
    setFilteredStockChecks(filteredStockChecks);
  }, [
    timeConditions,
    timeRangeConditions,
    timeConditionControls,
    stockChecks,
    rangeConditions,
  ]);

  const filters = [
    <TimeFilter
      key={2}
      title="Created date"
      className="mb-2"
      timeFilterControl={timeConditionControls.createdDate}
      singleTimeValue={timeConditions.createdDate}
      rangeTimeValue={timeRangeConditions.createdDate}
      onTimeFilterControlChanged={updateCreatedDateConditionControl}
      onSingleTimeFilterChanged={updateCreatedDateCondition}
      onRangeTimeFilterChanged={updateCreatedDateConditionRange}
    />,
    <RangeFilter
      key={7}
      title="Counted Stock"
      className="mb-2"
      range={rangeConditions.totalCountedStock}
      onValuesChanged={updateTotalCountedStockRangeCondition}
    />,
    <RangeFilter
      key={4}
      title="Stock"
      className="mb-2"
      range={rangeConditions.totalStock}
      onValuesChanged={updateTotalStockRangeCondition}
    />,
    <RangeFilter
      key={3}
      title="Total Value"
      className="mb-2"
      range={rangeConditions.totalValue}
      onValuesChanged={updateTotalValueRangeCondition}
    />,
    <RangeFilter
      key={5}
      title="Stock Difference"
      className="mb-2"
      range={rangeConditions.stockDifference}
      onValuesChanged={updateStockDifferenceRangeCondition}
    />,
    <RangeFilter
      key={6}
      title="Total Value Difference"
      className="mb-2"
      range={rangeConditions.totalValueDifference}
      onValuesChanged={updateTotalValueDifferenceRangeCondition}
    />,
  ];

  const headerButtons = [];
  if (userPermissions.stockCheck.create)
    headerButtons.push(
      <Button
        key={1}
        variant={"green"}
        onClick={() => router.push("/stock-check/new")}
      >
        New stock check
      </Button>,
    );

  return (
    <PageWithFilters title="Stock check" filters={filters} headerButtons={headerButtons}>
      <StockCheckDatatable data={filteredStockChecks} />
    </PageWithFilters>
  );
}
