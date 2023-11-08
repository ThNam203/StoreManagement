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
import {
  debtByCustomerColumnHeaders,
  profitByCustomerColumnHeaders,
  saleByCustomerColumnHeaders,
} from "./pdf_columns";
import { ReportPDFViewer } from "@/components/ui/pdf";
import { saleReportColumnHeaders } from "../daily/pdf_columns";
import {
  originalDebtByCustomerList,
  originalDebtCustomerChartData,
  originalProfitByCustomerList,
  originalPurchasedProductCustomerChartData,
  originalSaleByCustomerList,
} from "./fake_data";

enum Concern {
  SALE = "Sale",
  PROFIT = "Profit",
  DEBT = "Debt",
}

export default function CustomerReportLayout() {
  const [chartData, setChartData] = useState<
    { label: string; value: number }[]
  >([]);

  const [reportData, setReportData] = useState<Report>({
    headerData: {
      title: "Report on profits by customer",
      createdDate: new Date(),
      branch: "Center",
      rangeDate: {
        startDate: getStaticRangeFilterTime(FilterWeek.ThisWeek).startDate,
        endDate: new Date(),
      },
    },
    columnHeaders: profitByCustomerColumnHeaders,
    contentData: [],
  });
  const [customerList, setCustomerList] = useState<string[]>([]);

  const [singleFilter, setSingleFilter] = useState({
    displayType: DisplayType.CHART as string,
    concerns: Concern.SALE as string,
  });
  const [multiFilter, setMuliFilter] = useState({
    customer: [] as string[],
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
        const res = originalPurchasedProductCustomerChartData;
        setChartData(res);
      } else if (singleFilter.displayType === DisplayType.REPORT) {
        const res = originalSaleByCustomerList;

        setReportData({
          headerData: {
            title: "Report on sales by customer",
            createdDate: new Date(),
            branch: "Center",
            rangeDate: {
              startDate: getStaticRangeFilterTime(FilterWeek.ThisWeek)
                .startDate,
              endDate: new Date(),
            },
          },
          columnHeaders: saleByCustomerColumnHeaders,
          contentData: res,
        });
        const customerList = Array.from(
          new Set(res.map((row) => row.customerName))
        );
        setCustomerList(customerList);
      }
    } else if (singleFilter.concerns === Concern.DEBT) {
      if (singleFilter.displayType === DisplayType.CHART) {
        const res = originalDebtCustomerChartData;
        setChartData(res);
      } else if (singleFilter.displayType === DisplayType.REPORT) {
        const res = originalDebtByCustomerList;
        setReportData({
          headerData: {
            title: "Report on debts by customer",
            createdDate: new Date(),
            branch: "Center",
            rangeDate: {
              startDate: getStaticRangeFilterTime(FilterWeek.ThisWeek)
                .startDate,
              endDate: new Date(),
            },
          },
          columnHeaders: debtByCustomerColumnHeaders,
          contentData: res,
        });
        const customerList = Array.from(
          new Set(res.map((row) => row.customerName))
        );
        setCustomerList(customerList);
      }
    } else if (singleFilter.concerns === Concern.PROFIT) {
      const res = originalProfitByCustomerList;
      setReportData({
        headerData: {
          title: "Report on profit by customer",
          createdDate: new Date(),
          branch: "Center",
          rangeDate: {
            startDate: getStaticRangeFilterTime(FilterWeek.ThisWeek).startDate,
            endDate: new Date(),
          },
        },
        columnHeaders: profitByCustomerColumnHeaders,
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
        className={cn(customerList.length > 0 ? "visible" : "hidden")}
        choices={customerList}
        chosenValues={multiFilter.customer}
        title="Customer"
        placeholder="Search customer..."
      />
    </div>,
  ];

  const headerButtons = [<Button key={0}>More+</Button>];

  return (
    <PageWithFilters
      filters={filters}
      title="Customer Report"
      headerButtons={headerButtons}
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
            Top 10<sup>th</sup> customers with the highest number of products
            purchased
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
            singleFilter.concerns === Concern.DEBT &&
              singleFilter.displayType === DisplayType.CHART
              ? "visible"
              : "hidden"
          )}
        >
          <div className="text-center font-medium text-lg">
            Top 10<sup>th</sup> customers with the highest debt purchased
          </div>
          <SingleColumnChart
            data={chartData}
            label="Debt"
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
            singleFilter.concerns === Concern.DEBT &&
              singleFilter.displayType === DisplayType.REPORT
              ? "visible"
              : "hidden"
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
