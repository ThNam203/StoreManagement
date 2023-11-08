import { Report } from "@/entities/Report";
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
import {
  ArrowLeft,
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightToLine,
  Maximize,
  Printer,
  RefreshCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";
import { removeCharNotANum } from "@/utils";

export const ReportContentPDF = ({
  data,
  onNumOfPagesChange,
}: {
  data: Report;
  onNumOfPagesChange?: (numOfPages: number) => void;
}) => {
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
          {data.headerData.saleDate && (
            <Text style={styles.headerContent}>
              Sale date: {data.headerData.saleDate.toLocaleDateString()}
            </Text>
          )}
          {data.headerData.rangeDate && (
            <Text style={styles.headerContent}>
              {`From date ${data.headerData.rangeDate.startDate.toLocaleDateString()} to date ${data.headerData.rangeDate.endDate.toLocaleDateString()}`}
            </Text>
          )}

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
            render={({ pageNumber, totalPages }) => {
              if (onNumOfPagesChange) onNumOfPagesChange(totalPages);
              return `Page ${pageNumber} of ${totalPages}`;
            }}
          ></Text>
        </View>
      </Page>
    </Document>
  );
};

// Create Document Component
const ReportPdfViewer = ({
  data,
  classname = "w-full h-[800px]",
}: {
  data: Report;
  classname?: string;
}) => {
  const [currentPage, setCurrentPage] = useState("1");
  const [numOfPages, setNumOfPages] = useState(1);
  let tempPage = "1";
  const iconStyle = "bg-[transparent] text-white opacity-80 hover:opacity-100";
  const textStyle = " bg-[transparent] text-white";
  return (
    <div>
      <div className="flex flex-row space-x-6 bg-[#85909d] p-2 items-center align-center justify-center">
        <button className={iconStyle}>
          <RefreshCcw className="w-4 h-4" strokeWidth={3}></RefreshCcw>
        </button>
        <button className={iconStyle}>
          <ArrowLeftToLine
            className="w-4 h-4"
            strokeWidth={3}
          ></ArrowLeftToLine>
        </button>
        <button className={iconStyle}>
          <ArrowLeft className="w-4 h-4" strokeWidth={3}></ArrowLeft>
        </button>
        <div>
          <input
            type="number"
            maxLength={numOfPages.toString().length}
            defaultValue={"1"}
            onChange={(e) => {
              removeCharNotANum(e);
              tempPage = e.target.value;
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                setCurrentPage(tempPage);
              }
            }}
            className="w-8 text-center"
          ></input>
          <span className={textStyle}> / {numOfPages}</span>
        </div>

        <button className={iconStyle}>
          <ArrowRight className="w-4 h-4" strokeWidth={3}></ArrowRight>
        </button>
        <button className={iconStyle}>
          <ArrowRightToLine
            className="w-4 h-4"
            strokeWidth={3}
          ></ArrowRightToLine>
        </button>
        <button className={iconStyle}>
          <Printer className="w-4 h-4" strokeWidth={3}></Printer>
        </button>
        <button className={iconStyle}>
          <ZoomIn className="w-4 h-4" strokeWidth={3}></ZoomIn>
        </button>
        <button className={iconStyle}>
          <ZoomOut className="w-4 h-4" strokeWidth={3}></ZoomOut>
        </button>
        <button className={iconStyle}>
          <Maximize className="w-4 h-4" strokeWidth={3}></Maximize>
        </button>
      </div>
      <PDFViewer className={classname} showToolbar={false}>
        <ReportContentPDF data={data} onNumOfPagesChange={setNumOfPages} />
      </PDFViewer>
    </div>
  );
};

const ReportPdfDownloader = ({
  data,
  classname,
}: {
  data: Report;
  classname?: string;
}) => {
  return (
    <PDFDownloadLink
      document={<ReportContentPDF data={data} />}
      fileName="daily_report.pdf"
      className={classname}
    >
      {({ loading }) =>
        loading ? (
          <Button variant={"default"}>Loading document...</Button>
        ) : (
          <Button variant={"default"}>Download</Button>
        )
      }
    </PDFDownloadLink>
  );
};

const ReportPDFViewer = dynamic(() => Promise.resolve(ReportPdfViewer), {
  ssr: false,
});
const ReportPDFDownloader = dynamic(
  () => Promise.resolve(ReportPdfDownloader),
  {
    ssr: false,
  }
);

export { ReportPDFViewer, ReportPDFDownloader };
