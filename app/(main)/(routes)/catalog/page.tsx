"use client";
import { Button } from "@/components/ui/button";
import {
  ChoicesFilter,
  PageWithFilters,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";

const filters = [
  <ChoicesFilter
    key={1}
    title="Loại hàng"
    isSingleChoice={false}
    choices={["Hàng hóa", "Dịch vụ", "Combo"]}
  />,
  <ChoicesFilter
    key={2}
    title="Nhóm hàng"
    isSingleChoice={false}
    choices={["Tất cả", "Thuốc lá", "Sữa", "Nước ngọt", "Mỹ phẩm", "Kẹo bánh"]}
    defaultPositions={[
      "Tất cả",
      "Thuốc lá",
      "Sữa",
      "Nước ngọt",
      "Mỹ phẩm",
      "Kẹo bánh",
    ].map((val, index) => index)}
    className="my-4"
  />,
  <TimeFilter
    key={3}
    title="Sinh nhật"
    className="my-4"
    onRangeTimeFilterChanged={(range) => console.log(range)}
    onSingleTimeFilterChanged={(filterTime) => console.log(filterTime)}
  />,
  <SearchFilter
    key={4}
    title="Cửa hàng"
    placeholder="Tìm kiếm cửa hàng"
    className="my-4"
    choices={[
      "Cửa hàng A",
      "Cửa hàng B",
      "Cửa hàng CCửa hàng C",
      "Cửa hàng D",
      "Cửa hàng F",
    ]}
  />,
  <ChoicesFilter
    key={5}
    title="Tồn kho"
    isSingleChoice
    showPlusButton
    choices={[
      "Tất cả",
      "Dưới định mức tồn",
      "Vượt định mức tồn",
      "Còn hàng trong kho",
      "Hết hàng trong kho",
    ]}
    className="my-4"
  />,
];

const headerButtons = [
  <Button key={1}>More+</Button>,
]

export default function Catalog() {
  return (
    <PageWithFilters title="Products" filters={filters} headerButtons={headerButtons}>
      <p>HEHEHEHEHHEHEHEHEHHEHE</p>
    </PageWithFilters>
  );
}
