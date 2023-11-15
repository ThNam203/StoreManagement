"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { nanoid } from "nanoid";

import { Combobox } from "@/components/ui/combobox";
import { Sex, Staff } from "@/entities/Staff";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import {
  ChoicesFilter,
  PageWithFilters,
  SearchFilter,
} from "@/components/ui/filter";
import { Button } from "@/components/ui/button";
import { formatID, handleMultipleFilter } from "@/utils";

const originalStaffList: Staff[] = [
  {
    avatar: "",
    id: 1,
    name: "Henry",
    email: "henry@gmail.com",
    address: "address",
    phoneNumber: "0123456789",
    note: "",
    sex: Sex.MALE,
    CCCD: "012301923012",
    birthday: new Date("2003-8-4"),
    createAt: new Date(),
    branch: "Center",
    position: "Safe guard",
    salaryDebt: 0,
  },
  {
    avatar: "",
    id: 2,
    name: "Mary",
    email: "mary@gmail.com",
    address: "address Mary",
    phoneNumber: "0123456769",
    note: "",
    sex: Sex.FEMALE,
    CCCD: "012301923011",
    birthday: new Date("2003-4-4"),
    createAt: new Date(),
    branch: "Branch 1",
    position: "Cashier",
    salaryDebt: 0,
  },
  {
    avatar: "",
    id: 3,
    name: "David",
    email: "david@gmail.com",
    address: "address David",
    phoneNumber: "0124456789",
    note: "",
    sex: Sex.MALE,
    CCCD: "012301943012",
    birthday: new Date("2003-8-8"),
    createAt: new Date(),
    branch: "Branch 2",
    position: "Store Manager",
    salaryDebt: 0,
  },
];

export default function StaffInfoPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [filterdStaffList, setFilteredStaffList] = useState<Staff[]>([]);
  const [multiFilter, setMultiFilter] = useState({
    branch: [] as string[],
    position: [] as string[],
  });
  useEffect(() => {
    const res = originalStaffList;
    const formatedData: Staff[] = res.map((row) => {
      const newRow = { ...row };
      newRow.id = formatID(newRow.id, "NV");
      return newRow;
    });
    setStaffList(formatedData);
  }, []);
  useEffect(() => {
    var filteredList = [...staffList];
    filteredList = handleMultipleFilter(multiFilter, filteredList);

    setFilteredStaffList([...filteredList]);
  }, [multiFilter, staffList]);

  function handleFormSubmit(values: Staff) {
    setStaffList((prev) => [...prev, values]);
  }

  const updateBranchMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, branch: values }));
  };
  const updatePositionMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, position: values }));
  };

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <SearchFilter
        key={1}
        title="Position"
        placeholder="Search position"
        chosenValues={multiFilter.position}
        choices={Array.from(new Set(staffList.map((staff) => staff.position)))}
        onValuesChanged={updatePositionMultiFilter}
      />
      <SearchFilter
        key={2}
        title="Branch"
        placeholder="Search branch"
        chosenValues={multiFilter.branch}
        choices={Array.from(new Set(staffList.map((staff) => staff.branch)))}
        onValuesChanged={updateBranchMultiFilter}
      />
    </div>,
  ];
  const headerButtons = [<Button key={1}>More+</Button>];

  return (
    <PageWithFilters
      title="Staff"
      filters={filters}
      headerButtons={headerButtons}
    >
      <DataTable data={filterdStaffList} onSubmit={handleFormSubmit} />
    </PageWithFilters>
  );
}
