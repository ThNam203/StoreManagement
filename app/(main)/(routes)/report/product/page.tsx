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
import {
  FinanceReport,
  ProductReport,
  ProductSellReport,
  SaleByDayReport,
} from "@/entities/Report";
import { useAppDispatch } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import ReportService from "@/services/reportService";
import { TimeFilterType, getDateRangeFromTimeFilterCondition, handleRangeNumFilter } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductReportPage() {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [report, setReport] = useState<ProductReport | null>(null);
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
    quantitySell: {
      startValue: NaN,
      endValue: NaN,
    },
    quantityReturn: {
      startValue: NaN,
      endValue: NaN,
    },
    totalSell: {
      startValue: NaN,
      endValue: NaN,
    },
    totalReturn: {
      startValue: NaN,
      endValue: NaN,
    },
    total: {
      startValue: NaN,
      endValue: NaN,
    },
  });

  useEffect(() => {
    dispatch(showPreloader());
    const fetchReport = async () => {
      const report = await ReportService.getProductReport(
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
      title="Quantity return"
      range={valueRangeConditions.quantityReturn}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          quantityReturn: value,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={3}
      title="Quantity sell"
      range={valueRangeConditions.quantitySell}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          quantitySell: value,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={4}
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
      key={5}
      title="Total sell"
      range={valueRangeConditions.totalSell}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          totalSell: value,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={6}
      title="Total"
      range={valueRangeConditions.total}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          total: value,
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
      title="PRODUCT REPORT"
      dataProperties={[
        "productId",
        "name",
        "quantitySell",
        "quantityReturn",
        "totalSell",
        "totalReturn",
        "total",
      ]}
    />
  ) : null;

  return (
    <PageWithFilters filters={filters} title="Product Report">
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
