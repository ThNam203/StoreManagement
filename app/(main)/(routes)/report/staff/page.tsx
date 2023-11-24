"use client";

import { Button } from "@/components/ui/button";
import { SingleColumnChart } from "@/components/ui/column_chart";
import {
  ChoicesFilter,
  FilterTime,
  FilterWeek,
  PageWithFilters,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";
import { DisplayType, Report } from "@/entities/Report";
import { cn } from "@/lib/utils";
import { TimeFilterType, getStaticRangeFilterTime } from "@/utils";
import { useEffect, useState } from "react";

import { ReportPDFViewer } from "@/components/ui/pdf";
import { saleReportColumnHeaders } from "../daily/pdf_columns";
import { profitColumnHeaders, saleColumnHeaders } from "./pdf_columns";
import {
  originalProfitReportData,
  originalSaleChartData,
  originalSaleReportData,
} from "./fake_data";

enum Concern {
  SALE = "Sale",
  PROFIT = "Profit",
}

export default function CustomerReportLayout() {
  const [chartData, setChartData] = useState<
    { label: string; value: number }[]
  >([]);

  const [reportData, setReportData] = useState<Report>({
    headerData: {
      title: "Report on sale by staff",
      createdDate: new Date(),
      branch: "Center",
      rangeDate: {
        startDate: getStaticRangeFilterTime(FilterWeek.ThisWeek).startDate,
        endDate: new Date(),
      },
    },
    columnHeaders: saleColumnHeaders,
    contentData: [],
  });
  const [staffList, setStaffList] = useState<string[]>([]);
  const [goodsList, setGoodsList] = useState<string[]>([]);

  const [singleFilter, setSingleFilter] = useState({
    displayType: DisplayType.CHART as string,
    concerns: Concern.SALE as string,
  });
  const [multiFilter, setMuliFilter] = useState({
    staff: [] as string[],
    goods: [] as string[],
  });
  const [rangeTimeFilter, setRangeTimeFilter] = useState({
    rangeDate: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });
  const [staticRangeFilter, setStaticRangeFilter] = useState({
    rangeDate: FilterWeek.ThisWeek as FilterTime,
  });
  const [timeFilterControl, setTimeFilterControl] = useState({
    rangeDate: TimeFilterType.StaticRange as TimeFilterType,
  });

  useEffect(() => {
    if (singleFilter.concerns === Concern.SALE) {
      if (singleFilter.displayType === DisplayType.CHART) {
        const res = originalSaleChartData;
        setChartData(res);
      } else if (singleFilter.displayType === DisplayType.REPORT) {
        const res = originalSaleReportData;

        setReportData({
          headerData: {
            title: "Report on sales by staff",
            createdDate: new Date(),
            branch: "Center",
            rangeDate: {
              startDate: getStaticRangeFilterTime(FilterWeek.ThisWeek)
                .startDate,
              endDate: new Date(),
            },
          },
          columnHeaders: saleColumnHeaders,
          contentData: res,
        });
        const staffList = Array.from(new Set(res.map((row) => row.staff)));
        setStaffList(staffList);
      }
    } else if (singleFilter.concerns === Concern.PROFIT) {
      const res = originalProfitReportData;
      setReportData({
        headerData: {
          title: "Report on profit by staff",
          createdDate: new Date(),
          branch: "Center",
          rangeDate: {
            startDate: getStaticRangeFilterTime(FilterWeek.ThisWeek).startDate,
            endDate: new Date(),
          },
        },
        columnHeaders: profitColumnHeaders,
        contentData: res,
      });
    }
  }, [singleFilter]);

  const updateDisplayTypeSingleFilter = (value: string) => {
    setSingleFilter((prev) => ({ ...prev, displayType: value }));
  };
  const updateConcernSingleFilter = (value: string) => {
    setSingleFilter((prev) => ({ ...prev, concerns: value }));
  };
  const updateRangeDateTimeFilterControl = (value: TimeFilterType) => {
    setTimeFilterControl((prev) => ({ ...prev, rangeDate: value }));
  };

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <ChoicesFilter
        title="Display Type"
        key={1}
        isSingleChoice={true}
        choices={Object.values(DisplayType)}
        defaultValue={singleFilter.displayType}
        onSingleChoiceChanged={updateDisplayTypeSingleFilter}
      />
      <ChoicesFilter
        title="Concern"
        key={1}
        isSingleChoice={true}
        choices={Object.values(Concern)}
        defaultValue={singleFilter.concerns}
        onSingleChoiceChanged={updateConcernSingleFilter}
      />
      <TimeFilter
        title="Time"
        timeFilterControl={timeFilterControl.rangeDate}
        rangeTimeValue={rangeTimeFilter.rangeDate}
        singleTimeValue={staticRangeFilter.rangeDate}
        onTimeFilterControlChanged={updateRangeDateTimeFilterControl}
      />
      <SearchFilter
        className={cn(staffList.length > 0 ? "visible" : "hidden")}
        choices={staffList}
        chosenValues={multiFilter.staff}
        title="Staff"
        placeholder="Search customer..."
      />
      <SearchFilter
        choices={goodsList}
        chosenValues={multiFilter.goods}
        title="Goods"
        placeholder="Search goods..."
      />
    </div>,
  ];

  return (
    <PageWithFilters
      filters={filters}
      title="Staff Report"
    >
      <div>
        <div
          className={cn(
            singleFilter.concerns === Concern.SALE &&
              singleFilter.displayType === DisplayType.CHART
              ? "visible"
              : "hidden"
          )}
        >
          <div className="text-center font-medium text-lg">
            Top 10 customers with the highest number of products purchased
          </div>
          <SingleColumnChart
            data={chartData}
            label="Purchased Product"
            sortOption="value_desc"
            direction="y"
            limitNumOfLabels={10}
          />
        </div>
        <div
          className={cn(
            singleFilter.concerns === Concern.PROFIT ? "visible" : "hidden"
          )}
        >
          <ReportPDFViewer data={reportData} />
        </div>
        <div
          className={cn(
            singleFilter.concerns === Concern.SALE &&
              singleFilter.displayType === DisplayType.REPORT
              ? "visible"
              : "hidden"
          )}
        >
          <ReportPDFViewer data={reportData} />
        </div>
      </div>
    </PageWithFilters>
  );
}
