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

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: "10px",
    fontSize: "12px",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header_title: {
    fontWeight: 600,
    fontFamily: "Open Sans",
    fontSize: "24px",
  },

  header_content: {
    marginTop: "5px",
  },
  createdDate: {
    alignSelf: "flex-start",
  },
  table: {
    width: "100%",
    marginTop: "10px",
  },
  tableHeader: {
    margin: "auto",
    padding: "5px 0",
    flexDirection: "row",
    borderBottom: "0.5px solid black",
    backgroundColor: "#b2e8ff",
    fontFamily: "Open Sans",
    fontWeight: 600,
  },
  tableBody: {
    display: "flex",
    flexDirection: "column",
  },
  tableRow: {
    margin: "auto",
    padding: "5px 0",
    flexDirection: "row",
    borderBottom: "0.5px solid black",
    backgroundColor: "#f2eed6",
  },
  tableCol: {
    width: "15%",
  },
  tableCell: {
    margin: "auto",
    fontSize: 10,
  },
});

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
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
  const headers = Object.keys(columnHeaders);
  return (
    <PDFViewer className={classname}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.createdDate}>
              {data.headerData.createdDate.toLocaleString()}
            </Text>
            <Text style={styles.header_title}>Daily report</Text>
            <Text style={styles.header_content}>
              Sale date: {data.headerData.saleDate.toLocaleDateString()}
            </Text>
            <Text style={styles.header_content}>
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
                  <View key={index} style={styles.tableRow}>
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
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default dynamic(() => Promise.resolve(DailyReportPDF), {
  ssr: false,
});
