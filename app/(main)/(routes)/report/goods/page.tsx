"use client";

import { Button } from "@/components/ui/button";
import { SingleColumnChart } from "@/components/ui/column_chart";
import { ChoicesFilter, PageWithFilters } from "@/components/ui/filter";
import { useState } from "react";

export default function GoodsReportLayout() {
  const [singleFilter, setSingleFilter] = useState({
    displayType: "Chart",
    concerns: "Revenue",
  });
  const displayTypes = ["Chart", "Report"];
  const concerns = ["Revenue", "Sale"];

  const updateDisplayTypeSingleFilter = (value: string) => {
    setSingleFilter((prev) => ({ ...prev, displayType: value }));
  };

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <ChoicesFilter
        title="Display Type"
        key={1}
        isSingleChoice={true}
        choices={displayTypes}
        defaultValue={singleFilter.displayType}
        onSingleChoiceChanged={updateDisplayTypeSingleFilter}
      />
      <ChoicesFilter
        title="Concern"
        key={1}
        isSingleChoice={true}
        choices={concerns}
        defaultValue={singleFilter.concerns}
        onSingleChoiceChanged={updateDisplayTypeSingleFilter}
      />
    </div>,
  ];

  const headerButtons = [<Button key={0}>More+</Button>];

  const [revenueChartData, setRevenueChartDate] = useState<
    Array<{ label: string; value: number }>
  >([
    {
      label: "Snack",
      value: 100000,
    },
    {
      label: "Sting",
      value: 120000,
    },
    {
      label: "Cereal",
      value: 180000,
    },
    {
      label: "Gun",
      value: 160000,
    },
    {
      label: "Bom",
      value: 140000,
    },
    {
      label: "Drug",
      value: 250000,
    },
  ]);
  const [saleQuantityChartData, setSaleQuantityChartData] = useState<
    Array<{ label: string; value: number }>
  >([
    {
      label: "Snack",
      value: 20,
    },
    {
      label: "Sting",
      value: 25,
    },
    {
      label: "Cereal",
      value: 24,
    },
    {
      label: "Gun",
      value: 16,
    },
    {
      label: "Bom",
      value: 100,
    },
    {
      label: "Drug",
      value: 18,
    },
  ]);
  return (
    <PageWithFilters
      filters={filters}
      title="Goods Report"
      headerButtons={headerButtons}
    >
      <div className="flex flex-col space-y-16">
        <div>
          <div className="text-center font-medium text-lg">
            Top 10<sup>th</sup> products with the highest revenue
          </div>
          <SingleColumnChart
            data={revenueChartData}
            label="Revenue"
            sortOption="value_desc"
            direction="y"
            limitNumOfLabels={10}
          />
        </div>
        <div>
          <div className="text-center font-medium text-lg">
            Top 10<sup>th</sup> products with the highest quantity
          </div>
          <SingleColumnChart
            data={saleQuantityChartData}
            label="Quantity"
            direction="y"
            sortOption="value_desc"
            limitNumOfLabels={10}
          />
        </div>
      </div>
    </PageWithFilters>
  );
}
