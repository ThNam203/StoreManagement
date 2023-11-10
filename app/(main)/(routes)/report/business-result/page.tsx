"use client";

import { Button } from "@/components/ui/button";
import {
  ChoicesFilter,
  FilterGroup,
  FilterWeek,
  PageWithFilters,
  SecondaryTimeFilter,
} from "@/components/ui/filter";
import {
  MultiColumnChart,
  SingleColumnChart,
} from "@/components/ui/column_chart";
import { useEffect, useState } from "react";
import { DiscountType, Invoice } from "@/entities/Invoice";
import { TransactionType } from "@/entities/Transaction";
import { TimeFilterType, getStaticRangeFilterTime } from "@/utils";
import { cn } from "@/lib/utils";
import { ReportPDFViewer } from "@/components/ui/pdf";
import { BusinessReport } from "@/entities/Report";
import { rowHeaders } from "./pdf_rows";
import {
  originalBusinessReportData,
  originalMonthChartData,
  originalQuarterChartData,
} from "./fake_data";

enum DisplayType {
  Chart = "Chart",
  Report = "Report",
}

export default function SaleReportLayout() {
  const [businessReport, setBusinessReport] = useState<any>([]);
  const [reportData, setReportData] = useState<BusinessReport>({
    headerData: {
      title: "Report on business result",
      createdDate: new Date(),
      branch: "center",
      rangeDate: {
        startDate: getStaticRangeFilterTime(FilterWeek.ThisWeek).startDate,
        endDate: new Date(),
      },
    },
    rowHeaders: rowHeaders,
    contentData: businessReport,
  });
  const [chartData, setChartData] = useState<
    { label: string; value: number }[]
  >([]);
  const [singleFilter, setSingleFilter] = useState({
    displayType: DisplayType.Report as string,
  });
  const [staticRangeFilter, setStaticRangeFilter] = useState({
    rangeDate: FilterGroup.ByMonth,
  });
  const [rangeTimeFilter, setRangeTimeFilter] = useState({
    rangeDate: {
      startDate: getStaticRangeFilterTime(FilterWeek.ThisWeek).startDate,
      endDate: new Date(),
    },
  });
  const [timeFilterControl, setTimeFilterControl] = useState({
    rangeDate: TimeFilterType.StaticRange,
  });

  useEffect(() => {
    if (staticRangeFilter.rangeDate === FilterGroup.ByMonth) {
      if (singleFilter.displayType === DisplayType.Report) {
        const res = originalBusinessReportData;
        setBusinessReport(res);
        setReportData((prev) => ({ ...prev, contentData: businessReport }));
      } else if (singleFilter.displayType === DisplayType.Chart) {
        const res = originalMonthChartData;
        setChartData(res);
      }
    } else if (staticRangeFilter.rangeDate === FilterGroup.ByQuarter) {
      if (singleFilter.displayType === DisplayType.Report) {
        const res = originalBusinessReportData;
        setBusinessReport(res);
        setReportData((prev) => ({ ...prev, contentData: businessReport }));
      } else if (singleFilter.displayType === DisplayType.Chart) {
        const res = originalQuarterChartData;
        setChartData(res);
      }
    } else if (staticRangeFilter.rangeDate === FilterGroup.ByYear) {
      const res = originalBusinessReportData;
      setBusinessReport(res);
      setReportData((prev) => ({ ...prev, contentData: businessReport }));
    } else {
      const res = originalBusinessReportData;
      setBusinessReport(res);
      setReportData((prev) => ({ ...prev, contentData: businessReport }));
    }
  }, [
    staticRangeFilter,
    rangeTimeFilter,
    timeFilterControl,
    singleFilter,
    businessReport,
  ]);

  const updateDisplayTypeSingleFilter = (value: string) => {
    setSingleFilter((prev) => ({ ...prev, displayType: value }));
  };
  const updateRangeDateTimeFilterControl = (value: TimeFilterType) => {
    setTimeFilterControl((prev) => ({ ...prev, rangeDate: value }));
  };
  const updateRangeDateStaticRangeFilter = (value: FilterGroup) => {
    setStaticRangeFilter((prev) => ({ ...prev, rangeDate: value }));
  };
  const updateRangeDateRangeTimeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeTimeFilter((prev) => ({ ...prev, rangeDate: range }));
  };

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <ChoicesFilter
        title="Display Type"
        isSingleChoice={true}
        choices={Object.values(DisplayType)}
        defaultValue={singleFilter.displayType}
        onSingleChoiceChanged={updateDisplayTypeSingleFilter}
      />
      <SecondaryTimeFilter
        title="Time"
        timeFilterControl={timeFilterControl.rangeDate}
        singleTimeValue={staticRangeFilter.rangeDate}
        rangeTimeValue={rangeTimeFilter.rangeDate}
        onTimeFilterControlChanged={updateRangeDateTimeFilterControl}
        onSingleTimeFilterChanged={updateRangeDateStaticRangeFilter}
        onRangeTimeFilterChanged={updateRangeDateRangeTimeFilter}
      />
    </div>,
  ];

  const headerButtons = [<Button key={0}>More+</Button>];

  return (
    <PageWithFilters
      filters={filters}
      title="Sale Report"
      headerButtons={headerButtons}
    >
      <div
        className={cn(
          singleFilter.displayType === DisplayType.Chart ? "visible" : "hidden"
        )}
      >
        <div className="text-center font-medium text-lg">
          Revenue by quarter
        </div>
        <SingleColumnChart
          data={chartData}
          label="Revenue"
          viewOption="label_time_asc"
          reverseViewOption={true}
          limitNumOfLabels={10}
        />
      </div>
      <div
        className={cn(
          singleFilter.displayType === DisplayType.Report ? "visible" : "hidden"
        )}
      >
        <ReportPDFViewer data={reportData} contentType="business" />
      </div>
    </PageWithFilters>
  );
}
