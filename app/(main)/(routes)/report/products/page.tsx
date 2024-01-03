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
import { TopProductsReport } from "@/entities/Report";
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

export default function TopProductsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [report, setReport] = useState<TopProductsReport | null>(null);
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
    totalCustomer: {
      startValue: NaN,
      endValue: NaN,
    },
    totalQuantity: {
      startValue: NaN,
      endValue: NaN,
    },
    revenue: {
      startValue: NaN,
      endValue: NaN,
    },
    totalReturn: {
      startValue: NaN,
      endValue: NaN,
    },
    returnRevenue: {
      startValue: NaN,
      endValue: NaN,
    },
    netRevenue: {
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
      const report = await ReportService.getTopProductsRerport(
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
      className="mb-2"
    />,
    <RangeFilter
      key={2}
      title="Total customer"
      range={valueRangeConditions.totalCustomer}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          totalCustomer: value,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={3}
      title="Total quantity"
      range={valueRangeConditions.totalQuantity}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          totalQuantity: value,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={4}
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
      key={5}
      title="Total return"
      range={valueRangeConditions.totalReturn}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          totalReturn: value,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={6}
      title="Return revenue"
      range={valueRangeConditions.returnRevenue}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          returnRevenue: value,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={7}
      title="Net revenue"
      range={valueRangeConditions.netRevenue}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          netRevenue: value,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={8}
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
      title="PRODUCTS REPORT"
      dataProperties={[
        "productId",
        "totalCustomer",
        "totalQuantity",
        "revenue",
        "totalReturn",
        "returnRevenue",
        "netRevenue",
        "profit",
      ]}
    />
  ) : null;

  return (
    <PageWithFilters
      filters={filters}
      title="Products Report"
      headerButtons={[
        <ReportPDFDownloadButton
          key={0}
          PdfContent={PDF!}
        />,
      ]}
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
