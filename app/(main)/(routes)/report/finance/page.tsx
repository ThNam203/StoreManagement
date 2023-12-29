"use client";

import { PageWithFilters } from "@/components/ui/filter";
import {
  DefaultPDFContent,
  ReportPDFDownloadButton,
  ReportPDFView,
} from "@/components/ui/pdf";
import { useToast } from "@/components/ui/use-toast";
import { FinanceReport, ProductSellReport, SaleByDayReport } from "@/entities/Report";
import { useAppDispatch } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import ReportService from "@/services/reportService";
import { useEffect, useState } from "react";

export default function FinanceReportPage() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [report, setReport] = useState<FinanceReport | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    dispatch(showPreloader());
    const fetchReport = async () => {
      const report = await ReportService.getFinanceReport(
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
      data={[report]}
      startDate={startDate}
      endDate={endDate}
      title="FINANCE REPORT"
      dataProperties={[
        "salesRevenue",
        "adjustmentDiscount",
        "adjustmentReturn",
        "netRevenue",
        "costOfGoodsSold",
        "grossProfit",
        "salaryStaff",
        "bonusStaff",
        "penaltyStaff",
        "netProfit",
      ]}
    />
  ) : null;

  return (
    <PageWithFilters filters={[]} title="Finance Report">
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
