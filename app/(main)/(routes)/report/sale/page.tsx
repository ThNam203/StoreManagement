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

const originalInvoiceList: Invoice[] = [];
for (let i = 0; i < 5; i++) {
  originalInvoiceList.push({
    id: i,
    discountType: DiscountType.MONEY,
    discount: 80000,
    subTotal: 300000,
    total: 300000 - 10000 - 80000 + (i % 30) * 10000,
    moneyGiven: 250000,
    change: 40000,
    transactionType: TransactionType.CASH,
    createdDate: new Date(new Date().setDate(6)),
    creator: "NGUYEN VAN A",
    VAT: 10000,
  });
  originalInvoiceList.push({
    id: i,
    discountType: DiscountType.MONEY,
    discount: 80000,
    subTotal: 300000,
    total: 300000 - 10000 - 80000 + (i % 30) * 10000,
    moneyGiven: 250000,
    change: 40000,
    transactionType: TransactionType.CASH,
    createdDate: new Date(new Date().setHours(i % 24)),
    creator: "NGUYEN VAN A",
    VAT: 10000,
  });
}

enum DisplayType {
  CHART = "Chart",
  REPORT = "Report",
}
enum Concern {
  REVENUE = "Revenue",
  PROFIT = "Profit",
}

const groupByDate = (invoiceList: Invoice[]) => {
  const formatedRevenueData: Array<{ label: string; value: number }> = [];
  const temp: { createdDate: Date; total: number } = {
    createdDate: new Date(),
    total: 0,
  };
  let top = -1;

  const thisWeek = getStaticRangeFilterTime(FilterWeek.ThisWeek);
  thisWeek.startDate.setHours(0, 0, 0, 0);
  thisWeek.endDate.setHours(0, 0, 0, 0);
  console.log("range", thisWeek);
  invoiceList
    .filter(
      (invoice) =>
        invoice.createdDate >= thisWeek.startDate &&
        invoice.createdDate <= thisWeek.endDate
    )
    .sort((a, b) => {
      if (a.createdDate < b.createdDate) return -1;
      else return 1;
    })
    .forEach((invoice) => {
      if (top != -1) {
        if (
          invoice.createdDate.toLocaleDateString() ===
          new Date().toLocaleDateString()
        ) {
          if (invoice.createdDate.getHours() === temp.createdDate.getHours()) {
            formatedRevenueData[top].value += invoice.total;
          } else {
            const columnChart: { label: string; value: number } = {
              label: invoice.createdDate.toLocaleString(),
              value: invoice.total,
            };
            temp.createdDate = invoice.createdDate;
            temp.total = 0;
            formatedRevenueData.push(columnChart);
            top += 1;
          }
        } else {
          if (
            invoice.createdDate.toLocaleDateString() ===
            temp.createdDate.toLocaleDateString()
          ) {
            formatedRevenueData[top].value += invoice.total;
          } else {
            const columnChart: { label: string; value: number } = {
              label: invoice.createdDate.toLocaleString(),
              value: invoice.total,
            };
            temp.createdDate = invoice.createdDate;
            temp.total = 0;
            formatedRevenueData.push(columnChart);
            top += 1;
          }
        }
      } else {
        const columnChart: { label: string; value: number } = {
          label: invoice.createdDate.toLocaleString(),
          value: invoice.total,
        };
        temp.createdDate = invoice.createdDate;
        temp.total = 0;
        formatedRevenueData.push(columnChart);
        top += 1;
      }
    });

  return formatedRevenueData;
};

const originalProfitDataLabel = ["6/11/2023", "7/11/2023"];
const originalProfitDataValue = [
  [120000, 140000],
  [180000, 180000],
  [60000, 40000],
];

export default function SaleReportLayout() {
  const [revenueDataList, setRevenueDataList] = useState<
    Array<{ label: string; value: number }>
  >([]);
  const [profitDataLabel, setProfitDataLabel] = useState<string[]>([]);
  const [profitDataValue, setProfitDataValue] = useState<number[][]>([]);
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
  const [singleFilter, setSingleFilter] = useState({
    displayType: DisplayType.CHART as string,
    concern: Concern.REVENUE as string,
  });

  useEffect(() => {
    const resInvoiceList = originalInvoiceList;
    setInvoiceList(resInvoiceList);

    if (singleFilter.concern === Concern.REVENUE) {
      const formatedRevenueData = groupByDate(invoiceList);
      setRevenueDataList(formatedRevenueData);
    } else if (singleFilter.concern === Concern.PROFIT) {
      setProfitDataLabel(originalProfitDataLabel);
      setProfitDataValue(originalProfitDataValue);
    }
  }, [invoiceList, singleFilter.concern]);

  const updateDisplayTypeSingleFilter = (value: string) => {
    setSingleFilter((prev) => ({ ...prev, displayType: value }));
  };
  const updateConcernSingleFilter = (value: string) => {
    setSingleFilter((prev) => ({ ...prev, concern: value }));
  };

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <ChoicesFilter
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
      />
    </div>,
  ];

  const headerButtons = [<Button key={0}>More+</Button>];

  return (
    <PageWithFilters
      filters={filters}
      title="Sale Report"
      headerButtons={headerButtons}
    >
      <div
        className={cn(
          singleFilter.concern === Concern.REVENUE ? "visible" : "hidden"
        )}
      >
        <div className="text-center font-medium text-lg">
          Revenue of this week
        </div>
        <SingleColumnChart
          data={revenueDataList}
          label="Revenue"
          viewOption="label_time_desc"
          reverseViewOption={true}
          limitNumOfLabels={10}
        />
      </div>
      <div
        className={cn(
          singleFilter.concern === Concern.PROFIT ? "visible" : "hidden"
        )}
      >
        <div className="text-center font-medium text-lg">
          Profit of this week
        </div>
        <MultiColumnChart
          dataLabel={profitDataLabel}
          dataValue={profitDataValue}
          label={["Original Price", "Revenue", "Profit"]}
          viewOption="label_desc"
          limitNumOfLabels={10}
        />
      </div>
    </PageWithFilters>
  );
}
