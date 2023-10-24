"use client";
import { ChoicesFilter, TimeFilter } from "@/components/ui/filter";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function Catalog() {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col flex-1 px-4 py-2 rounded-sm min-w-0 bg-white">
        <h2 className="text-start font-semibold text-2xl my-4">Products</h2>
      </div>

      <ScrollArea className="ml-6 h-screen">
        <ChoicesFilter
          title="Loại hàng"
          isSingleChoice={false}
          choices={["Hàng hóa", "Dịch vụ", "Combo"]}
        />

        <ChoicesFilter
          title="Nhóm hàng"
          isSingleChoice={false}
          choices={[
            "Tất cả",
            "Thuốc lá",
            "Sữa",
            "Nước ngọt",
            "Mỹ phẩm",
            "Kẹo bánh",
          ]}
          defaultPositions={[
            "Tất cả",
            "Thuốc lá",
            "Sữa",
            "Nước ngọt",
            "Mỹ phẩm",
            "Kẹo bánh",
          ].map((val, index) => index)}
          className="my-4"
        />

        <ChoicesFilter
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
        />

        <TimeFilter
          title="Sinh nhật"
          onRangeTimeFilterChanged={(range) => console.log(range)}
          onSingleTimeFilterChanged={(filterTime) => console.log(filterTime)}
        />
      </ScrollArea>
    </div>
  );
}
