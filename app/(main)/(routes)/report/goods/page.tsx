"use client";

import { Button } from "@/components/ui/button";
import { ChoicesFilter, PageWithFilters } from "@/components/ui/filter";
import Charts from "@/components/ui/report/report_sale_chart";
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
  return (
    <PageWithFilters
      filters={filters}
      title="Goods Report"
      headerButtons={headerButtons}
    >
      <div className="text-center font-medium text-lg">
        Top 10<sup>th</sup> products with the highest revenue
      </div>
      <Charts.HorizontalBarChart></Charts.HorizontalBarChart>
    </PageWithFilters>
  );
}
