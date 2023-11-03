import { DailyReport } from "@/entities/Report";
import {
  Document,
  PDFDownloadLink,
  PDFViewer,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import getStylePDF from "./pdf_style";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Printer } from "lucide-react";

export const ReportContentPDF = ({ data }: { data: DailyReport }) => {
  const columnHeaders = data.columnHeaders;
  const headers = Object.keys(columnHeaders);
  const styles = getStylePDF({ numOfCols: headers.length });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerCreatedDate}>
            {data.headerData.createdDate.toLocaleString()}
          </Text>
          <Text style={styles.headerTitle}>{data.headerData.title}</Text>
          <Text style={styles.headerContent}>
            Sale date: {data.headerData.saleDate.toLocaleDateString()}
          </Text>
          <Text style={styles.headerContent}>
            Branch: {data.headerData.branch}
          </Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            {headers.map((header) => {
              return (
                <View key={header} style={styles.tableCol}>
                  <Text style={styles.tableCell}>{columnHeaders[header]}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.tableBody}>
            {data.contentData.map((row, index) => {
              return (
                <View key={index} style={styles.tableRow} wrap={false}>
                  {headers.map((header) => {
                    const value: any = row[header as keyof typeof row];
                    if (value !== undefined) {
                      const formatedValue =
                        value instanceof Date
                          ? value.toLocaleTimeString()
                          : value;
                      return (
                        <View key={header + index} style={styles.tableCol}>
                          <Text style={styles.tableCell}>{formatedValue}</Text>
                        </View>
                      );
                    }
                  })}
                </View>
              );
            })}
          </View>
        </View>
        <View style={styles.footer} fixed>
          <Text
            style={styles.footerContent}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          ></Text>
        </View>
      </Page>
    </Document>
  );
};

// Create Document Component
const ReportPDFViewer = ({
  data,
  classname = "w-full h-[800px]",
}: {
  data: DailyReport;
  classname?: string;
}) => {
  return (
    <PDFViewer className={classname} showToolbar={false}>
      <ReportContentPDF data={data} />
    </PDFViewer>
  );
};

const ReportPDFDownloader = ({ data }: { data: DailyReport }) => {
  return (
    <Button asChild variant={"default"}>
      {/* <Printer className=" w-4 h-4"></Printer> */}
      <PDFDownloadLink
        document={<ReportContentPDF data={data} />}
        fileName="daily_report.pdf"
      />
    </Button>
  );
};

const DailyReportPDFViewer = dynamic(() => Promise.resolve(ReportPDFViewer), {
  ssr: false,
});
const DailyReportPDFDownloader = dynamic(
  () => Promise.resolve(ReportPDFDownloader),
  {
    ssr: false,
  }
);

export { DailyReportPDFViewer, DailyReportPDFDownloader };
