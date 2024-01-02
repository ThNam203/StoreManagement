"use client";

import { FilterDay, FilterTime, PageWithFilters, SearchFilterObject, TimeFilter } from "@/components/ui/filter";
import {
  DefaultPDFContent,
  ReportPDFDownloadButton,
  ReportPDFView,
} from "@/components/ui/pdf";
import { useToast } from "@/components/ui/use-toast";
import { CustomerReport, ProductSellReport, SaleByDayReport } from "@/entities/Report";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { setStaffs } from "@/reducers/staffReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import ReportService from "@/services/reportService";
import StaffService from "@/services/staff_service";
import { TimeFilterType, getDateRangeFromTimeFilterCondition } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerReportPage() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [report, setReport] = useState<CustomerReport | null>(null);
  const staffs = useAppSelector((state) => state.staffs.value);
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

  const [customerCreatorCondition, setCustomerCreatorCondition] = useState<
  { id: number; name: string }[]
>([]);

  useEffect(() => {
    dispatch(showPreloader());
    const fetchReport = async () => {
      const report = await ReportService.getCustomerReport(
        range.startDate,
        range.endDate,
      );
      setReport(report.data);

      const staffs = await StaffService.getAllStaffs();
      dispatch(setStaffs(staffs.data));
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
    <SearchFilterObject
      key={3}
      placeholder="Find creator..."
      title="Creator"
      values={customerCreatorCondition.map((group) => ({
        id: group.id,
        name: group.name,
        displayString: group.name,
      }))}
      choices={staffs.map((group) => ({
        id: group.id,
        name: group.name,
        displayString: group.name,
      }))}
      filter={(value: any, queryString: string) =>
        value.id.toString().includes(queryString) ||
        value.name.includes(queryString)
      }
      onValuesChanged={(values) =>
        setCustomerCreatorCondition([
          ...values.map((v: any) => {
            return { id: v.id, name: v.name };
          }),
        ])
      }
      className="mb-2"
    />,
  ];

  const PDF = report ? (
    <DefaultPDFContent
      data={report}
      startDate={range.startDate}
      endDate={range.endDate}
      title="CUSTOMER REPORT"
      dataProperties={[
        "customerId",
        "customerName",
        "subTotal",
        "discountValue",
        "revenue",
        "returnRevenue",
        "netRevenue",
      ]}
    />
  ) : null;

  return (
    <PageWithFilters filters={filters} title="Customer Report">
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
