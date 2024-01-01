"use client";

import {
  FilterDay,
  FilterTime,
  PageWithFilters,
  TimeFilter
} from "@/components/ui/filter";
import {
  PdfContentFooter,
  ReportPDFDownloadButton,
  ReportPDFView,
} from "@/components/ui/pdf";
import { getDefaultStylePDF } from "@/components/ui/pdf_style";
import { useToast } from "@/components/ui/use-toast";
import { SaleTransactionReport } from "@/entities/Report";
import { useAppDispatch } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import ReportService from "@/services/reportService";
import { TimeFilterType, camelToPascalWithSpaces, getDateRangeFromTimeFilterCondition } from "@/utils";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function SaleTransactionPage() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [report, setReport] = useState<SaleTransactionReport | null>(null);
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

  useEffect(() => {
    dispatch(showPreloader());
    const fetchReport = async () => {
      const report = await ReportService.getSaleTransactionReport(
        range.startDate,
        range.endDate,
      );
      setReport(report.data);
    };

    fetchReport()
      .catch((err) => axiosUIErrorHandler(err, toast))
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
  ];

  const PDF = report ? (
    <PDFContent data={report} startDate={range.startDate} endDate={range.endDate} />
  ) : null;

  return (
    <PageWithFilters filters={filters} title="Sale Transaction Report">
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

const PDFContent = ({
  data,
  startDate,
  endDate,
}: {
  data: SaleTransactionReport;
  startDate: Date;
  endDate: Date;
}) => {
  const styles = getDefaultStylePDF(4);
  const invoiceProperties = ["invoiceId", "date", "quantity", "total"];
  const returnProperties = ["returnId", "date", "quantity", "total"];
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerCreatedDate}>
            {format(new Date(), "MM/dd/yyyy")}
          </Text>
          <Text style={styles.headerTitle}>SALE TRANSACTION REPORT</Text>

          <Text style={styles.headerContent}>
            {`${format(startDate, "MM/dd/yyyy")} to date ${format(
              endDate,
              "MM/dd/yyyy",
            )}`}
          </Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            {invoiceProperties.map((header) => {
              return (
                <View key={header} style={styles.tableCol}>
                  <Text style={styles.tableCell}>{camelToPascalWithSpaces(header)}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.tableBody}>
            {data.invoices.map((invoice, index) => {
              return (
                <View key={index} style={styles.tableRow} wrap={false}>
                  {invoiceProperties.map((header) => {
                    const value: number | string =
                      invoice[header as keyof typeof invoice];
                    return (
                      <View key={header + index} style={styles.tableCol}>
                        <Text style={styles.tableCell}>{value}</Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
            <View style={styles.tableHeader}>
              {returnProperties.map((header) => {
                return (
                  <View key={header} style={styles.tableCol}>
                    <Text style={styles.tableCell}>{camelToPascalWithSpaces(header)}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.tableBody}>
              {data.returns.map((returnInvoice, index) => {
                return (
                  <View key={index} style={styles.tableRow} wrap={false}>
                    {returnProperties.map((header) => {
                      const value: number | string =
                        returnInvoice[header as keyof typeof returnInvoice];
                      return (
                        <View key={header + index} style={styles.tableCol}>
                          <Text style={styles.tableCell}>{value}</Text>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        <PdfContentFooter styles={styles} />
      </Page>
    </Document>
  );
};