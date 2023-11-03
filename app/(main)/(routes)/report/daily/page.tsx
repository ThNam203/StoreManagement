"use client";
import { Button } from "@/components/ui/button";
import { ChoicesFilter, PageWithFilters } from "@/components/ui/filter";
import { DailyReport, FundReport, SaleReport } from "@/entities/Report";
import { FormType } from "@/entities/Transaction";
import { formatID } from "@/utils";
import { useEffect, useState } from "react";
import {
  fundReportColumnHeaders,
  saleReportColumnHeaders,
} from "./pdf_columns";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  DailyReportPDFDownloader,
  DailyReportPDFViewer,
} from "@/components/ui/pdf";

const originalSaleReportList: SaleReport[] = [];
const originalFundReportList: FundReport[] = [];
//create copied data
for (let i = 0; i < 50; i++) {
  originalSaleReportList.push({
    transactionId: 1,
    time: new Date(),
    quantity: 20,
    revenue: 200000,
    otherFees: 10000,
    totalSale: 200000 - 10000,
  });
}

for (let i = 0; i < 50; i++) {
  originalFundReportList.push({
    formId: 1,
    formType: FormType.EXPENSE,
    targetName: "Nguyen Van A",
    time: new Date(),
  });
  originalFundReportList.push({
    formId: 2,
    formType: FormType.RECEIPT,
    targetName: "Nguyen Van B",
    time: new Date(),
  });
}

export default function ReportDayLayout() {
  const [loading, setLoading] = useState(true);
  const [singleFilter, setSingleFilter] = useState({
    concern: "Sale Report",
  });
  const [dailyReport, setDailyReport] = useState<DailyReport>({
    headerData: {
      title: "Daily Report",
      createdDate: new Date(),
      branch: "Center",
      saleDate: new Date(),
    },
    columnHeaders: {},
    contentData: [],
  });

  useEffect(() => {
    const fetchSaleReportData = async () => {
      const res = originalSaleReportList;
      const formatedData: SaleReport[] = res.map((row) => {
        const newRow = { ...row };
        newRow.transactionId = formatID(newRow.transactionId, "MDD");
        return newRow;
      });
      setDailyReport((prev) => ({
        headerData: {
          ...prev.headerData,
          title: "Daily report about sale",
          createdDate: new Date(),
          saleDate: new Date(),
        },
        columnHeaders: saleReportColumnHeaders,
        contentData: formatedData,
      }));
    };
    const fetchFundReportData = async () => {
      const res = originalFundReportList;
      const formatedData: FundReport[] = res.map((row) => {
        const newRow = { ...row };
        newRow.formId = formatID(newRow.formId, "MP");
        return newRow;
      });
      setDailyReport((prev) => ({
        headerData: {
          ...prev.headerData,
          title: "Daily report about fund",
          createdDate: new Date(),
          saleDate: new Date(),
        },
        columnHeaders: fundReportColumnHeaders,
        contentData: formatedData,
      }));
    };
    setLoading(true);
    if (singleFilter.concern === "Sale Report") fetchSaleReportData();
    else if (singleFilter.concern === "Fund Report") fetchFundReportData();
    setLoading(false);
  }, [singleFilter]);

  const updateConcernSingleFilter = (value: string) => {
    setSingleFilter((prev) => ({ ...prev, concern: value }));
  };

  const choices = ["Sale Report", "Fund Report"];
  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <ChoicesFilter
        title="Concern"
        key={1}
        isSingleChoice={true}
        choices={choices}
        defaultValue={singleFilter.concern}
        onSingleChoiceChanged={updateConcernSingleFilter}
      />
    </div>,
  ];

  const headerButtons = [<Button key={0}>More+</Button>];
  return (
    <PageWithFilters
      filters={filters}
      title="Daily Report"
      headerButtons={headerButtons}
    >
      <DailyReportPDFDownloader data={dailyReport} />
      {loading ? (
        <div className="w-full h-[1000px] animate-pulse bg-[#e6e6e6] text-center pt-4">
          Loading...
        </div>
      ) : (
        <DailyReportPDFViewer
          data={dailyReport}
          classname="w-full h-[1000px]"
        />
      )}
    </PageWithFilters>
  );
}
