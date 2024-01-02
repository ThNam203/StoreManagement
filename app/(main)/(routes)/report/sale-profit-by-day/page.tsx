"use client";

import {
  FilterDay,
  FilterTime,
  PageWithFilters,
  RangeFilter,
  TimeFilter,
} from "@/components/ui/filter";
import {
  DefaultPDFContent,
  ReportPDFDownloadButton,
  ReportPDFView,
} from "@/components/ui/pdf";
import { useToast } from "@/components/ui/use-toast";
import { SaleProfitByDayReport } from "@/entities/Report";
import { useAppDispatch } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import ReportService from "@/services/reportService";
import {
  TimeFilterType,
  getDateRangeFromTimeFilterCondition,
  handleRangeNumFilter,
  handleRangeTimeFilter,
} from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SaleReportLayout() {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [report, setReport] = useState<SaleProfitByDayReport | null>(null);
  const [reportDateRangeCondition, setReportDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [reportDateSingleCondition, setReportDateSingleCondition] = useState(
    FilterDay.Today as FilterTime,
  );
  const [reportDateControl, setReportDateControl] = useState<TimeFilterType>(
    TimeFilterType.StaticRange,
  );
  const range = getDateRangeFromTimeFilterCondition(
    reportDateControl,
    reportDateSingleCondition,
    reportDateRangeCondition,
  );

  const [valueRangeConditions, setValueRangeConditions] = useState({
    revenue: {
      startValue: NaN,
      endValue: NaN,
    },
    costPrice: {
      startValue: NaN,
      endValue: NaN,
    },
    profit: {
      startValue: NaN,
      endValue: NaN,
    },
  });

  useEffect(() => {
    dispatch(showPreloader());
    const fetchReport = async () => {
      const report = await ReportService.getSaleProfitByDayReport(
        range.startDate,
        range.endDate,
      );

      const reportData = report.data;
      const filteredData = handleRangeNumFilter(
        valueRangeConditions,
        reportData,
      );
      setReport(filteredData);
    };

    fetchReport()
      .catch((err) => axiosUIErrorHandler(err, toast, router))
      .finally(() => dispatch(disablePreloader()));
  }, [reportDateRangeCondition, reportDateSingleCondition, reportDateControl]);

  const filters = [
    <TimeFilter
      key={1}
      title="Report range"
      timeFilterControl={reportDateControl}
      singleTimeValue={reportDateSingleCondition}
      rangeTimeValue={reportDateRangeCondition}
      onTimeFilterControlChanged={(value) => setReportDateControl(value)}
      onSingleTimeFilterChanged={(value) => setReportDateSingleCondition(value)}
      onRangeTimeFilterChanged={(value) => setReportDateRange(value)}
    />,
    <RangeFilter
      key={2}
      title="Revenue"
      range={valueRangeConditions.revenue}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          revenue: value,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={3}
      title="Cost price"
      range={valueRangeConditions.costPrice}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          costPrice: value,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={4}
      title="Profit"
      range={valueRangeConditions.profit}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          profit: value,
        })
      }
      className="mb-2"
    />,
  ];

  const PDF = report ? (
    <DefaultPDFContent
      data={report}
      startDate={range.startDate}
      endDate={range.endDate}
      title="SALE PROFIT BY DAY REPORT"
      dataProperties={["date", "revenue", "costPrice", "profit"]}
    />
  ) : null;

  return (
    <PageWithFilters filters={filters} title="Sale Profit By Day Report">
      <div className="flex flex-col space-y-4">
        {report ? (
          <>
            <ReportPDFDownloadButton PdfContent={PDF!} classname="self-end" />
            <ReportPDFView
              PdfContent={PDF!}
              classname="w-full h-[1000px] bg-black"
            />
          </>
        ) : null}
      </div>
    </PageWithFilters>
  );
}
