"use client";
import { Button } from "@/components/ui/button";
import { PageWithFilters } from "@/components/ui/filter";
import DailyReportPDF from "@/components/ui/pdf";
import { DailyReport, DataTableDailyReport } from "@/entities/Report";
import { formatID } from "@/utils";
import { useEffect, useState } from "react";

const originalDailyReportList: DataTableDailyReport[] = [
  {
    transactionId: 1,
    time: new Date(),
    quantity: 100,
    revenue: 10000000,
    otherFees: 10000,
    totalSale: 10000000 - 10000,
  },
  {
    transactionId: 2,
    time: new Date(),
    quantity: 150,
    revenue: 15000000,
    otherFees: 20000,
    totalSale: 15000000 - 20000,
  },
  {
    transactionId: 3,
    time: new Date(),
    quantity: 20,
    revenue: 200000,
    otherFees: 10000,
    totalSale: 200000 - 10000,
  },
];

export default function ReportDayLayout() {
  const [datatable, setDatatable] = useState<DataTableDailyReport[]>([]);
  const [dailyReport, setDailyReport] = useState<DailyReport>({
    headerData: {
      createdDate: new Date(),
      branch: "Center",
      saleDate: new Date(),
    },
    contentData: datatable,
  });
  const contentDataColumnHeaders = {
    transactionId: "Transaction ID",
    time: "Time",
    quantity: "Quantity",
    revenue: "Revenue",
    otherFees: "Other Fees",
    totalSale: "Total Sale",
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = originalDailyReportList;
      const formatedData: DataTableDailyReport[] = res.map((row) => {
        const newRow = { ...row };
        newRow.transactionId = formatID(newRow.transactionId, "MDD");
        return newRow;
      });
      setDatatable(formatedData);
    };
    fetchData();
  }, []);
  useEffect(() => {
    setDailyReport((prev) => ({
      ...prev,
      contentData: datatable,
    }));
  }, [datatable]);

  const filters = [<div key={1} className="flex flex-col space-y-2"></div>];

  const headerButtons = [<Button key={0}>More+</Button>];
  return (
    <PageWithFilters
      filters={filters}
      title="Daily Report"
      headerButtons={headerButtons}
    >
      <DailyReportPDF
        data={dailyReport}
        columnHeaders={contentDataColumnHeaders}
        classname="w-full h-[1000px]"
      />
    </PageWithFilters>
  );
}
