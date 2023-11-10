"use client";

import { Button } from "@/components/ui/button";
import {
  ChoicesFilter,
  FilterWeek,
  PageWithFilters,
} from "@/components/ui/filter";
import {
  MultiColumnChart,
  SingleColumnChart,
} from "@/components/ui/column_chart";
import { useEffect, useState } from "react";
import { DiscountType, Invoice } from "@/entities/Invoice";
import { TransactionType } from "@/entities/Transaction";
import { getStaticRangeFilterTime } from "@/utils";
import { cn } from "@/lib/utils";
import { ReportPDFViewer } from "@/components/ui/pdf";
import { BusinessReport } from "@/entities/Report";
import { rowHeaders } from "./pdf_rows";
import { originalbusinessReportData } from "./fake_data";

export default function SaleReportLayout() {
  const [businessReport, setBusinessReport] = useState<any>([]);
  const [reportData, setReportData] = useState<BusinessReport>({
    headerData: {
      title: "Report on business result",
      createdDate: new Date(),
      branch: "center",
      rangeDate: {
        startDate: getStaticRangeFilterTime(FilterWeek.ThisWeek).startDate,
        endDate: new Date(),
      },
    },
    rowHeaders: rowHeaders,
    contentData: businessReport,
  });

  useEffect(() => {
    const res = originalbusinessReportData;
    setBusinessReport(res);
    setReportData((prev) => ({ ...prev, contentData: businessReport }));
  }, [businessReport]);

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      {/* <ChoicesFilter
        title="Display Type"
        key={1}
        isSingleChoice={true}
        choices={Object.values(DisplayType)}
        defaultValue={singleFilter.displayType}
        onSingleChoiceChanged={updateDisplayTypeSingleFilter}
      />
      <ChoicesFilter
        title="Concern"
        key={1}
        isSingleChoice={true}
        choices={Object.values(Concern)}
        defaultValue={singleFilter.concern}
        onSingleChoiceChanged={updateConcernSingleFilter}
      /> */}
    </div>,
  ];

  const headerButtons = [<Button key={0}>More+</Button>];

  return (
    <PageWithFilters
      filters={filters}
      title="Sale Report"
      headerButtons={headerButtons}
    >
      <ReportPDFViewer data={reportData} contentType="business" />
    </PageWithFilters>
  );
}
