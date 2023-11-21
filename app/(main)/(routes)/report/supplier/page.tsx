"use client";

import { Button } from "@/components/ui/button";
import {
  MultiColumnChart,
  SingleColumnChart,
} from "@/components/ui/column_chart";
import {
  ChoicesFilter,
  FilterTime,
  FilterWeek,
  PageWithFilters,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";
import { ReportPDFViewer } from "@/components/ui/pdf";
import { DisplayType, Report } from "@/entities/Report";
import { cn } from "@/lib/utils";
import { TimeFilterType, getStaticRangeFilterTime } from "@/utils";
import { useEffect, useState } from "react";

import {
  supplierDebtColumnHeaders,
  supplierImportGoodsColumnHeaders,
} from "./pdf_columns";
import {
  originalDebtChartData,
  originalDebtReportData,
  originalImportGoodsChartData,
  originalImportGoodsReportData,
} from "./fake_data";

enum Concern {
  IMPORT = "Import",
  DEBT = "Debt",
}

export default function SupplierReportLayout() {
  const [singleColChartData, setChartData] = useState<
    { label: string; value: number }[]
  >([]);
  const [multiColChartData, setMultiColChartData] = useState<{
    labels: string[];
    value: number[][];
  }>({
    labels: [],
    value: [],
  });

  const [reportData, setReportData] = useState<Report>({
    headerData: {
      title: "Report imported goods by supplier",
      createdDate: new Date(),
      branch: "Center",
      rangeDate: {
        startDate: getStaticRangeFilterTime(FilterWeek.ThisWeek).startDate,
        endDate: new Date(),
      },
    },
    columnHeaders: supplierImportGoodsColumnHeaders,
    contentData: [],
  });
  const [supplierList, setSupplierList] = useState<string[]>([]);

  const [singleFilter, setSingleFilter] = useState({
    displayType: DisplayType.CHART as string,
    concerns: Concern.IMPORT as string,
  });
  const [multiFilter, setMuliFilter] = useState({
    supplier: [] as string[],
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
    if (singleFilter.concerns === Concern.IMPORT) {
      if (singleFilter.displayType === DisplayType.CHART) {
        const res = originalImportGoodsChartData;
        setMultiColChartData(res);
      } else if (singleFilter.displayType === DisplayType.REPORT) {
        const res = originalImportGoodsReportData;

        setReportData({
          headerData: {
            title: "Report imported goods by supplier",
            createdDate: new Date(),
            branch: "Center",
            rangeDate: {
              startDate: getStaticRangeFilterTime(FilterWeek.ThisWeek)
                .startDate,
              endDate: new Date(),
            },
          },
          columnHeaders: supplierImportGoodsColumnHeaders,
          contentData: res,
        });
        const supplierList = Array.from(new Set(res.map((row) => row.name)));
        setSupplierList(supplierList);
      }
    } else if (singleFilter.concerns === Concern.DEBT) {
      if (singleFilter.displayType === DisplayType.CHART) {
        const res = originalDebtChartData;
        setChartData(res);
      } else if (singleFilter.displayType === DisplayType.REPORT) {
        const res = originalDebtReportData;
        setReportData({
          headerData: {
            title: "Report on debts by supplier",
            createdDate: new Date(),
            branch: "Center",
            rangeDate: {
              startDate: getStaticRangeFilterTime(FilterWeek.ThisWeek)
                .startDate,
              endDate: new Date(),
            },
          },
          columnHeaders: supplierDebtColumnHeaders,
          contentData: res,
        });
        const supplierList = Array.from(new Set(res.map((row) => row.name)));
        setSupplierList(supplierList);
      }
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
        className={cn(supplierList.length > 0 ? "visible" : "hidden")}
        choices={supplierList}
        chosenValues={multiFilter.supplier}
        title="Supplier"
        placeholder="Search supplier..."
      />
    </div>,
  ];

  return (
    <PageWithFilters
      filters={filters}
      title="Supplier Report"
    >
      <div>
        <div
          className={cn(
            singleFilter.concerns === Concern.IMPORT &&
              singleFilter.displayType === DisplayType.CHART
              ? "visible"
              : "hidden"
          )}
        >
          <div className="text-center font-medium text-lg">
            Top 10 suppliers with the most provided products
          </div>
          <MultiColumnChart
            dataLabel={multiColChartData.labels}
            dataValue={multiColChartData.value}
            label={["Import value", "Return value", "Net value"]}
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
            Top 10 suppliers with the most debt
          </div>
          <SingleColumnChart
            data={singleColChartData}
            label="Debt"
            sortOption="value_desc"
            direction="y"
            limitNumOfLabels={10}
          />
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
            singleFilter.concerns === Concern.IMPORT &&
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
