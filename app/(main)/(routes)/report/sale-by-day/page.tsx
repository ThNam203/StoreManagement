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
import { SaleByDayReport } from "@/entities/Report";
import { useAppDispatch } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import ReportService from "@/services/reportService";
import {
  TimeFilterType,
  getDateRangeFromTimeFilterCondition,
  handleRangeNumFilter,
} from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SaleByDayPage() {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [report, setReport] = useState<SaleByDayReport | null>(null);
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
    total: {
      startValue: NaN,
      endValue: NaN,
    },
    originalPrice: {
      startValue: NaN,
      endValue: NaN,
    },
    income: {
      startValue: NaN,
      endValue: NaN,
    },
  });

  useEffect(() => {
    dispatch(showPreloader());
    const fetchReport = async () => {
      const report = await ReportService.getSaleByDayReport(
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
  }, [reportDateRangeCondition, reportDateSingleCondition, reportDateControl, valueRangeConditions]);

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
      className="mb-2"
    />,
    <RangeFilter
      key={2}
      title="Total"
      range={valueRangeConditions.total}
      onValuesChanged={(value) =>
        setValueRangeConditions((prev) => ({ ...prev, total: value }))
      }
      className="mb-2"
    />,
    <RangeFilter
      key={3}
      title="Original Price"
      range={valueRangeConditions.originalPrice}
      onValuesChanged={(value) =>
        setValueRangeConditions((prev) => ({ ...prev, originalPrice: value }))
      }
      className="mb-2"
    />,
    <RangeFilter
      key={4}
      title="Income"
      range={valueRangeConditions.income}
      onValuesChanged={(value) =>
        setValueRangeConditions((prev) => ({ ...prev, income: value }))
      }
      className="mb-2"
    />,
  ];

  const PDF = report ? (
    <DefaultPDFContent
      data={report}
      startDate={range.startDate}
      endDate={range.endDate}
      title="SALE BY DAY REPORT"
      dataProperties={["date", "total", "originalPrice", "income"]}
    />
  ) : null;

  return (
    <PageWithFilters
      filters={filters}
      title="Sale By Day Report"
      headerButtons={[<ReportPDFDownloadButton key={0} PdfContent={PDF!} />]}
    >
      <div className="flex flex-col space-y-4">
        {report ? (
          <ReportPDFView
            PdfContent={PDF!}
            classname="w-full h-[1000px] bg-black"
          />
        ) : null}
      </div>
    </PageWithFilters>
  );
}
