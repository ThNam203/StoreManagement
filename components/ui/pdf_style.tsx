import { Font, StyleSheet } from "@react-pdf/renderer";

export const getDefaultStylePDF = ({ numOfCols }: { numOfCols: number }) => {
  const styles = StyleSheet.create({
    page: {
      width: "100%",
      backgroundColor: "#fff",
      padding: "10px 20px 40px",
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
      width: `calc(100% / ${numOfCols} - 10px)`,
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

  return styles;
};

export const getBusinessStylePDF = ({ numOfCols }: { numOfCols: number }) => {
  const styles = StyleSheet.create({
    page: {
      width: "100%",
      backgroundColor: "#fff",
      padding: "10px 20px 40px",
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
      fontSize: "18px",
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
      padding: "5px 10px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
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
      padding: "5px 10px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottom: "0.5px solid black",
      backgroundColor: "#f2eed6",
    },
    tableFirstCol: {
      width: "100px",
      textAlign: "left",
    },
    tableCol: {
      maxWidth: "100px",
      width: `calc(100% / ${numOfCols})`,
      textAlign: "right",
    },
    tableCell: {
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

  return styles;
};
