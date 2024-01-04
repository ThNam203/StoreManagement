import { camelToPascalWithSpaces, removeCharNotANum } from "@/utils";
import {
  Document,
  PDFDownloadLink,
  PDFViewer,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
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
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "./button";
import { format } from "date-fns";
import { getDefaultStylePDF } from "./pdf_style";
import { FinanceReport } from "@/entities/Report";

//   data,
//   onNumOfPagesChange,
// }: {
//   data: BusinessReport;
//   onNumOfPagesChange?: (numOfPages: number) => void;
// }) => {
//   const rowHeaders = data.rowHeaders;
//   const headerKeys = Object.keys(rowHeaders);
//   const styles = getBusinessStylePDF({
//     numOfCols: data.contentData.length <= 4 ? data.contentData.length + 1 : 5,
//   });
//   const pages: any[][] = [];
//   let page: any[] = [];
//   data.contentData.forEach((item) => {
//     if (page.length < 3) page.push(item);
//     else {
//       page.push(item);
//       pages.push(page);
//       page = [];
//     }
//   });
//   if (page.length > 0) pages.push(page);

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.header}>
//           <Text style={styles.headerCreatedDate}>
//             {data.headerData.createdDate.toLocaleString()}
//           </Text>
//           <Text style={styles.headerTitle}>{data.headerData.title}</Text>
//           {data.headerData.saleDate && (
//             <Text style={styles.headerContent}>
//               Sale date: {data.headerData.saleDate.toLocaleDateString()}
//             </Text>
//           )}
//           {data.headerData.rangeDate && (
//             <Text style={styles.headerContent}>
//               {`From date ${format(
//                 data.headerData.rangeDate.startDate,
//                 "dd/MM/yyyy"
//               )} to date ${format(
//                 data.headerData.rangeDate.endDate,
//                 "dd/MM/yyyy"
//               )}`}
//             </Text>
//           )}

//           <Text style={styles.headerContent}>
//             Branch: {data.headerData.branch}
//           </Text>
//         </View>
//         {pages.map((page, index) => {
//           return (
//             <View key={index} style={styles.table} wrap={false}>
//               <View style={styles.tableHeader}>
//                 <View key={"No header"} style={styles.tableFirstCol}>
//                   <Text style={styles.tableCell}></Text>
//                 </View>
//                 {page.map((item, index) => {
//                   return (
//                     <View key={index} style={styles.tableCol}>
//                       <Text style={styles.tableCell}>{item.header}</Text>
//                     </View>
//                   );
//                 })}
//               </View>

//               <View style={styles.tableBody}>
//                 {headerKeys.map((header, index) => {
//                   if (header !== "header") {
//                     return (
//                       <View key={index} style={styles.tableRow} wrap={false}>
//                         <View key={header + index} style={styles.tableFirstCol}>
//                           <Text style={styles.tableCell}>
//                             {rowHeaders[header]}
//                           </Text>
//                         </View>
//                         {page.map((item) => {
//                           const value = item[header as keyof typeof item];
//                           if (value !== undefined && Number.isInteger(value)) {
//                             const formatedValue = formatPrice(value);
//                             return (
//                               <View
//                                 key={header + index}
//                                 style={styles.tableCol}
//                               >
//                                 <Text style={styles.tableCell}>
//                                   {formatedValue}
//                                 </Text>
//                               </View>
//                             );
//                           }
//                         })}
//                       </View>
//                     );
//                   }
//                 })}
//               </View>
//             </View>
//           );
//         })}

//         <View style={styles.footer} fixed>
//           <Text
//             style={styles.footerContent}
//             render={({ pageNumber, totalPages }) => {
//               if (onNumOfPagesChange) onNumOfPagesChange(totalPages);
//               return `Page ${pageNumber} of ${totalPages}`;
//             }}
//           ></Text>
//         </View>
//       </Page>
//     </Document>
//   );
// };

// Create Document Component
const ReportPdfContainer = ({
  classname = "w-full h-[800px]",
  PdfContent,
}: {
  classname?: string;
  PdfContent: JSX.Element;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState(1);
  const iconStyle = "bg-[transparent] text-white opacity-80 hover:opacity-100";
  const textStyle = " bg-[transparent] text-white";
  return (
    <>
      {/* <div className="align-center flex flex-row items-center justify-center space-x-6 bg-[#85909d] p-2">
        <button className={iconStyle}>
          <RefreshCcw className="h-4 w-4" strokeWidth={3}></RefreshCcw>
        </button>
        <button className={iconStyle}>
          <ArrowLeftToLine
            className="h-4 w-4"
            strokeWidth={3}
          ></ArrowLeftToLine>
        </button>
        <button className={iconStyle}>
          <ArrowLeft className="h-4 w-4" strokeWidth={3}></ArrowLeft>
        </button>
        <div>
          <input
            type="number"
            maxLength={numOfPages.toString().length}
            defaultValue={1}
            onChange={(e) => {
              removeCharNotANum(e);
              setCurrentPage(e.target.valueAsNumber);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                setCurrentPage(e.currentTarget.valueAsNumber);
              }
            }}
            className="w-8 text-center"
          ></input>
          <span className={textStyle}> / {numOfPages}</span>
        </div>
        <button className={iconStyle}>
          <ArrowRight className="h-4 w-4" strokeWidth={3}></ArrowRight>
        </button>
        <button className={iconStyle}>
          <ArrowRightToLine
            className="h-4 w-4"
            strokeWidth={3}
          ></ArrowRightToLine>
        </button>
        <button className={iconStyle}>
          <Printer className="h-4 w-4" strokeWidth={3}></Printer>
        </button>
      </div> */}
      <PDFViewer className={classname} showToolbar={false}>
        {PdfContent}
      </PDFViewer>
    </>
  );
};

const PdfContentFooter = ({ styles }: { styles: any }) => (
  <View style={styles.footer} fixed>
    <Text
      style={styles.footerContent}
      render={({ pageNumber, totalPages }) => {
        return `Page ${pageNumber} of ${totalPages}`;
      }}
    ></Text>
  </View>
);

const ReportPdfDownloader = ({
  PdfContent,
  fileName = "report.pdf",
  classname,
}: {
  PdfContent: JSX.Element;
  fileName?: string;
  classname?: string;
}) => {
  return (
    <PDFDownloadLink
      document={PdfContent}
      fileName={fileName}
      className={classname}
    >
      {({ loading }) =>
        loading ? (
          <Button variant={"red"}>Loading document...</Button>
        ) : (
          <Button variant={"green"}>Download</Button>
        )
      }
    </PDFDownloadLink>
  );
};

const DefaultPDFContent = ({
  data,
  dataProperties,
  title,
  startDate,
  endDate,
}: {
  data: any[];
  dataProperties: string[];
  title: string;
  startDate: Date;
  endDate: Date;
}) => {
  const styles = getDefaultStylePDF(dataProperties.length);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerCreatedDate}>
            {format(new Date(), "MM/dd/yyyy")}
          </Text>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerContent}>
            {`${format(startDate, "MM/dd/yyyy")} to ${format(
              endDate,
              "MM/dd/yyyy",
            )}`}
          </Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            {dataProperties.map((property) => {
              return (
                <View key={property} style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {camelToPascalWithSpaces(property)}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.tableBody}>
            {data.map((report, index) => {
              return (
                <View key={index} style={styles.tableRow} wrap={false}>
                  {dataProperties.map((property) => {
                    let value: number | string =
                      report[property as keyof typeof report];
                    if (property === "date" || property === "Date" || property === "createdAt" || property === "createdDate")
                      value = format(new Date(value), "MM/dd/yyyy");
                    
                    return (
                      <View key={property + index} style={styles.tableCol}>
                        <Text style={styles.tableCell}>{value}</Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </View>
        <PdfContentFooter styles={styles} />
      </Page>
    </Document>
  );
};
const FinanceReportPDFContent = ({
  data,
  startDate,
  endDate,
}: {
  data: FinanceReport;
  startDate: Date;
  endDate: Date;
}) => {
  const styles = getDefaultStylePDF(1);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerCreatedDate}>
            {format(new Date(), "MM/dd/yyyy")}
          </Text>
          <Text style={styles.headerTitle}>FINANCE REPORT RIGHT?</Text>
          <Text style={styles.headerContent}>
            {`${format(startDate, "MM/dd/yyyy")} to ${format(
              endDate,
              "MM/dd/yyyy",
            )}`}
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {Object.keys(data).map((key) => {
            return (
              <View
                key={key}
                style={{ display: "flex", alignItems: "center", flexDirection: "row" }}
                wrap={false}
              >
                <View
                  key={key}
                  style={{ flexBasis: "100px", flexGrow: 1, flexShrink: 1, backgroundColor: "#f2eed6", padding: "16px" }}
                >
                  <Text style={{fontSize: 16, textAlign: "center"}}>
                    {camelToPascalWithSpaces(key)}
                  </Text>
                </View>
                <View
                  key={key}
                  style={{ flexBasis: "100px", flexGrow: 1, flexShrink: 1 }}
                >
                  <Text style={{fontSize: 16, textAlign: "center"}}>
                    {data[key as keyof typeof data]}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <PdfContentFooter styles={styles} />
      </Page>
    </Document>
  );
};

const ReportPDFView = dynamic(() => Promise.resolve(ReportPdfContainer), {
  ssr: false,
});

const ReportPDFDownloadButton = dynamic(
  () => Promise.resolve(ReportPdfDownloader),
  {
    ssr: false,
  },
);

export {
  PdfContentFooter,
  DefaultPDFContent,
  FinanceReportPDFContent,
  ReportPDFDownloadButton,
  ReportPDFView,
};
