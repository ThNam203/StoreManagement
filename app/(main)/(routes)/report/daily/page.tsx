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
    transactionId: i,
    time: new Date(),
    quantity: 20 * i,
    revenue: 200000 * i,
    otherFees: 10000,
    totalSale: 200000 * i - 10000,
  });
}

for (let i = 0; i < 50; i++) {
  originalFundReportList.push({
    formId: i,
    formType: FormType.EXPENSE,
    targetName: "Nguyen Van A",
    time: new Date(),
  });
}

export default function DailyReportLayout() {
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

  const choices = ["Sale", "Fund"];
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
      <div className="flex flex-col space-y-4">
        <DailyReportPDFDownloader data={dailyReport} classname="self-end" />
        <DailyReportPDFViewer
          data={dailyReport}
          classname="w-full h-[1000px]"
        />
      </div>
    </PageWithFilters>
  );
}
