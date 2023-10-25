"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { nanoid } from "nanoid";

import { Combobox } from "@/components/ui/combobox";
import { Staff } from "@/entities/Staff";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import { ChoicesFilter, PageWithFilters } from "@/components/ui/filter";
import { Button } from "@/components/ui/button";

const originalStaffList: Staff[] = [
  {
    avatar: "",
    id: "1",
    name: "Henry",
    email: "henry@gmail.com",
    address: "address",
    phoneNumber: "0123456789",
    note: "",
    sex: "male",
    CCCD: "012301923012",
    birthday: new Date("2003-8-4").toLocaleDateString(),
    createAt: new Date().toLocaleDateString(),
    branch: "Center",
    position: "Safe guard",
  },
  {
    avatar: "",
    id: "2",
    name: "Mary",
    email: "mary@gmail.com",
    address: "address Mary",
    phoneNumber: "0123456769",
    note: "",
    sex: "female",
    CCCD: "012301923011",
    birthday: new Date("2003-4-4").toLocaleDateString(),
    createAt: new Date().toLocaleDateString(),
    branch: "Branch 1",
    position: "Cashier",
  },
  {
    avatar: "",
    id: "3",
    name: "David",
    email: "david@gmail.com",
    address: "address David",
    phoneNumber: "0124456789",
    note: "",
    sex: "male",
    CCCD: "012301943012",
    birthday: new Date("2003-8-8").toLocaleDateString(),
    createAt: new Date().toLocaleDateString(),
    branch: "Branch 2",
    position: "Store Manager",
  },
];

const positionList = ["Owner", "Cashier", "Safe Guard", "Manager", "Cleaner"];

const branchList = ["Center Branch", "Branch 1", "Branch 2", "Branch 3"];

const filters = [
  <div key={1} className="flex flex-col space-y-2">
    <ChoicesFilter
      title="Position"
      isSingleChoice={false}
      choices={positionList}
    />
    <ChoicesFilter title="Branch" isSingleChoice={false} choices={branchList} />
  </div>,
];

const headerButtons = [<Button key={1}>More+</Button>];

const formatID = (id: number) => {
  return `KH${id.toString().padStart(4, "0")}`;
};

export default function StaffInfoPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  useEffect(() => {
    const res = originalStaffList;
    setStaffList(res);
  }, []);

  function handleFormSubmit(values: Staff) {
    setStaffList((prev) => [...prev, values]);
  }

  return (
    <PageWithFilters
      title="Staff"
      filters={filters}
      headerButtons={headerButtons}
    >
      <DataTable data={staffList} onSubmit={handleFormSubmit} />
    </PageWithFilters>
  );
}
