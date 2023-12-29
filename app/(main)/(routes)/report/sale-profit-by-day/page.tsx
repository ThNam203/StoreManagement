"use client";

import { PageWithFilters } from "@/components/ui/filter";
import {
  DefaultPDFContent,
  PdfContentFooter,
  ReportPDFDownloadButton,
  ReportPDFView,
} from "@/components/ui/pdf";
import { getDefaultStylePDF } from "@/components/ui/pdf_style";
import { useToast } from "@/components/ui/use-toast";
import {
  SaleProfitByDayReport,
  SaleTransactionReport,
} from "@/entities/Report";
import { useAppDispatch } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import ReportService from "@/services/reportService";
import { camelToPascalWithSpaces } from "@/utils";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function SaleReportLayout() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [report, setReport] = useState<SaleProfitByDayReport | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    dispatch(showPreloader());
    const fetchReport = async () => {
      const report = await ReportService.getSaleProfitByDayReport(
        startDate,
        endDate,
      );
      setReport(report.data);
    };

    fetchReport()
      .catch((err) => axiosUIErrorHandler(err, toast))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  const PDF = report ? (
    <DefaultPDFContent
      data={report}
      startDate={startDate}
      endDate={endDate}
      title="SALE PROFIT BY DAY REPORT"
      dataProperties={["date", "revenue", "costPrice", "profit"]}
    />
  ) : null;

  return (
    <PageWithFilters filters={[]} title="Sale Profit By Day Report">
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
