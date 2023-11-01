import { DailyReport } from "@/entities/Report";
import {
  Document,
  Font,
  PDFViewer,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useState } from "react";

// Create styles
const styles = StyleSheet.create({
  page: {
    width: "100%",
    backgroundColor: "#fff",
    padding: "20px 20px 40px",
    fontSize: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  headerTitle: {
    fontWeight: 700,
    fontFamily: "OpenSans",
    fontSize: "24px",
  },

  headerContent: {
    marginTop: "5px",
  },
  headerCreatedDate: {
    alignSelf: "flex-start",
  },
  footer: {
    width: "100%",
    position: "absolute",
    bottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  footerContent: { alignSelf: "center" },
  table: {
    width: "100%",
    marginTop: "10px",
  },
  tableHeader: {
    width: "100%",
    margin: "auto",
    padding: "5px 0",
    flexDirection: "row",
    borderBottom: "0.5px solid black",
    backgroundColor: "#b2e8ff",
    fontFamily: "OpenSans",
    fontWeight: 600,
  },
  tableBody: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  tableRow: {
    width: "100%",
    margin: "auto",
    padding: "5px 0",
    flexDirection: "row",
    borderBottom: "0.5px solid black",
    backgroundColor: "#f2eed6",
  },
  tableCol: {
    width: "calc(100% / 6 - 10px)",
  },
  tableCell: {
    margin: "auto",
    fontSize: 10,
  },
});

Font.register({
  family: "OpenSans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-300.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});

// Create Document Component
const DailyReportPDF = ({
  data,
  columnHeaders,
  classname = "w-full h-[800px]",
}: {
  data: DailyReport;
  columnHeaders: Record<string, string>;
  classname?: string;
}) => {
  const [loading, setLoading] = useState(true);
  const headers = Object.keys(columnHeaders);

  useEffect(() => {
    setLoading(false);
  }, [data]);
  return (
    <PDFViewer className={classname} showToolbar={false}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.headerCreatedDate}>
              {data.headerData.createdDate.toLocaleString()}
            </Text>
            <Text style={styles.headerTitle}>Daily report</Text>
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
                    <Text style={styles.tableCell}>
                      {columnHeaders[header]}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.tableBody}>
              {data.contentData.map((row, index) => {
                return (
                  <View key={index} style={styles.tableRow} wrap={false}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.transactionId}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {row.time.toLocaleTimeString()}
                      </Text>
                    </View>

                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.quantity}</Text>
                    </View>

                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.revenue}</Text>
                    </View>

                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.otherFees}</Text>
                    </View>

                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.totalSale}</Text>
                    </View>
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
            >
              Hello
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default dynamic(() => Promise.resolve(DailyReportPDF), {
  ssr: false,
});
