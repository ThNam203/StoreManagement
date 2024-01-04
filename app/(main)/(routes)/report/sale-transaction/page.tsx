"use client";

import {
  FilterDay,
  FilterTime,
  PageWithFilters,
  RangeFilter,
  TimeFilter,
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
import {
  TimeFilterType,
  camelToPascalWithSpaces,
  getDateRangeFromTimeFilterCondition,
  handleRangeNumFilter,
} from "@/utils";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SaleTransactionPage() {
  const { toast } = useToast();
  const router = useRouter();
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

  const [valueRangeConditions, setValueRangeConditions] = useState({
    invoiceQuantity: {
      startValue: NaN,
      endValue: NaN,
    },
    invoiceTotal: {
      startValue: NaN,
      endValue: NaN,
    },
    returnQuantity: {
      startValue: NaN,
      endValue: NaN,
    },
    returnTotal: {
      startValue: NaN,
      endValue: NaN,
    },
  });

  useEffect(() => {
    dispatch(showPreloader());
    const fetchReport = async () => {
      const report = await ReportService.getSaleTransactionReport(
        range.startDate,
        range.endDate,
      );

      const reportData = report.data;

      const invoices = handleRangeNumFilter(
        {
          quantity: valueRangeConditions.invoiceQuantity,
          total: valueRangeConditions.invoiceTotal,
        },
        reportData.invoices,
      );

      const returns = handleRangeNumFilter(
        {
          quantity: valueRangeConditions.returnQuantity,
          total: valueRangeConditions.returnTotal,
        },
        reportData.returns,
      );

      setReport({
        ...reportData,
        invoices: invoices,
        returns: returns,
      });
    };

    fetchReport()
      .catch((err) => axiosUIErrorHandler(err, toast, router))
      .finally(() => dispatch(disablePreloader()));
  }, [
    reportDateRangeCondition,
    reportDateSingleCondition,
    reportDateControl,
    valueRangeConditions,
  ]);

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
      title="Invoice Quantity"
      range={valueRangeConditions.invoiceQuantity}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          invoiceQuantity: value,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={3}
      title="Invoice Total"
      range={valueRangeConditions.invoiceTotal}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          invoiceTotal: value,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={4}
      title="Return Quantity"
      range={valueRangeConditions.returnQuantity}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          returnQuantity: value,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={5}
      title="Return Total"
      range={valueRangeConditions.returnTotal}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          returnTotal: value,
        })
      }
      className="mb-2"
    />,
  ];

  const PDF = report ? (
    <PDFContent
      data={report}
      startDate={range.startDate}
      endDate={range.endDate}
    />
  ) : null;

  return (
    <PageWithFilters
      filters={filters}
      title="Sale Transaction Report"
      headerButtons={[<ReportPDFDownloadButton key={1} PdfContent={PDF!} />]}
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
                  <Text style={styles.tableCell}>
                    {camelToPascalWithSpaces(header)}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.tableBody}>
            {data.invoices.map((invoice, index) => {
              return (
                <View key={index} style={styles.tableRow} wrap={false}>
                  {invoiceProperties.map((header) => {
                    let value: number | string =
                      invoice[header as keyof typeof invoice];
                      if (header === "date" || header === "Date") value = format(new Date(value), "MM/dd/yyyy");
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
                    <Text style={styles.tableCell}>
                      {camelToPascalWithSpaces(header)}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.tableBody}>
              {data.returns.map((returnInvoice, index) => {
                return (
                  <View key={index} style={styles.tableRow} wrap={false}>
                    {returnProperties.map((header) => {
                      let value: number | string =
                        returnInvoice[header as keyof typeof returnInvoice];
                      if (header === "date" || header === "Date") value = format(new Date(value), "MM/dd/yyyy");
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
