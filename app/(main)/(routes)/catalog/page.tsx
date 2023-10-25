"use client";
import Filter from "@/components/ui/filter";

export default function Catalog() {
  const choices = ["Nam", "Danh", "Huy", "Khoi", "Son"];

  return (
    <Filter
      title="Người giao"
      isSingleChoice={false}
      defaultPosition={1}
      choices={choices}
    />
  );
}
