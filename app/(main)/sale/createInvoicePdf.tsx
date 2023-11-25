import { Invoice } from "@/entities/Invoice";
import { format, parseISO } from "date-fns";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { create } from "domain";

const pdfStyleSheet = StyleSheet.create({
  page: {
    padding: 20,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#E4E4E4",
  },
  invoiceTitle: {
    fontSize: 24,
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  firstDescription: {
    display: "flex",
    flexDirection: "column",
    flex: "100 1 1",
  },
  secondDescription: {
    display: "flex",
    flexDirection: "column",
    flex: "100 1 1",
  },
  descriptionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  flexJustifyBetween: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
});

const createInvoicePdf = async (invoice: Invoice) => {
  const InvoiceView = () => (
    <Document>
      <Page size="A4" style={pdfStyleSheet.page}>
        <Text style={pdfStyleSheet.invoiceTitle}>Invoice</Text>
        <View style={pdfStyleSheet.description}>
          <View style={pdfStyleSheet.firstDescription}>
            <Text style={pdfStyleSheet.descriptionTitle}>
              Invoice&apos;s id: {invoice.id}
            </Text>
            <Text style={pdfStyleSheet.descriptionTitle}>Staff: Nam Huynh</Text>
          </View>
          <View style={pdfStyleSheet.secondDescription}>
            <Text style={pdfStyleSheet.descriptionTitle}>
              Issued date: {format(parseISO(invoice.createdAt), "dd/MM/yyyy")}
            </Text>
            <Text style={pdfStyleSheet.descriptionTitle}>
              Issued hours: {format(parseISO(invoice.createdAt), "mm:hh")}
            </Text>
          </View>
        </View>
        <View style={pdfStyleSheet.flexJustifyBetween}>
          <Text style={{ fontWeight: "bold" }}>Sub total:</Text>
          <Text style={{ fontWeight: "normal" }}>{invoice.subTotal}</Text>
        </View>
        {invoice.discountCode ? (
          <View style={{ ...pdfStyleSheet.flexJustifyBetween, marginTop: 10 }}>
            <Text style={{ fontWeight: "bold" }}>Discount applied:</Text>
            <Text style={{ fontWeight: "normal" }}>{invoice.discountCode}</Text>
          </View>
        ) : null}
        <View
          style={{
            width: "100%",
            height: 0,
            borderBottom: "1 solid #aaaaaa",
            marginVertical: 10,
          }}
        />
        <View style={pdfStyleSheet.flexJustifyBetween}>
          <Text style={{ fontWeight: "bold" }}>
            Total &#40;Pay by {invoice.paymentMethod}&#41;:
          </Text>
          <Text style={{ fontWeight: "normal" }}>{invoice.total}</Text>
        </View>
      </Page>
    </Document>
  );

  const blob = await pdf(InvoiceView()).toBlob();
  const objectURL = URL.createObjectURL(blob);

  const iframe = document.createElement("iframe");
  iframe.style.display = "none"; // Hide the iframe
  document.body.appendChild(iframe);
  iframe.src = objectURL;
  iframe.onload = () => {
    iframe.contentWindow!.print();
    URL.revokeObjectURL(objectURL);
  };
};

export default createInvoicePdf;
