"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { nanoid } from "nanoid";

import { Combobox } from "@/components/ui/combobox";
import { useState } from "react";
import { AddStaffDialog } from "./add_staff_dialog";
import { DataTable } from "./datatable";
import { Staff } from "@/entities/Staff";

const originalStaffList: Staff[] = [
  {
    id: nanoid(),
    name: "Henry",
    staffGroup: null,
    position: "Safe guard",
    branch: "Center",
    CCCD: "012301923012",
    phoneNumber: "0123456789",
    address: "address",
    sex: "male",
    email: "henry@gmail.com",
    birthday: "1/1/2003",
  },
  {
    id: nanoid(),
    name: "David",
    staffGroup: null,
    position: "Staff",
    branch: "Center",
    CCCD: "012301923013",
    phoneNumber: "0123456788",
    address: "address",
    sex: "male",
    email: "david@gmail.com",
    birthday: "1/1/2003",
  },
  {
    id: nanoid(),
    name: "Laura",
    staffGroup: null,
    position: "Store Manager",
    branch: "Center",
    CCCD: "012301923014",
    phoneNumber: "0123456787",
    address: "address",
    sex: "male",
    email: "laura@gmail.com",
    birthday: "1/1/2003",
  },
];

const positionList = ["Owner", "Cashier", "Safe Guard", "Manager", "Cleaner"];

const branchList = ["Center Branch", "Branch 1", "Branch 2", "Branch 3"];

export default function StaffInfoPage() {
  const [staffList, setStaffList] = useState<Staff[]>(originalStaffList);

  function handleFormSubmit(values: Staff) {
    setStaffList((prev) => [...prev, values]);
  }

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-start-1 col-span-5">
        <div className="p-4 rounded-lg bg-white overflow-hidden">
          <h2 className="text-start font-semibold text-3xl my-4">Staff</h2>
          <DataTable data={staffList} onSubmit={handleFormSubmit} />
        </div>
      </div>
      <div className="col-start-6 col-span-1">
        <div className="flex flex-col">
          <Collapsible className="w-full rounded-lg bg-white p-4">
            <div className="flex flex-row justify-between">
              <span className="font-bold select-none">Position</span>
              <CollapsibleTrigger asChild>
                <ChevronDown
                  color="black"
                  className="opacity-60 hover:opacity-100 cursor-pointer"
                />
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="data-[state=open]:animate-[slide-down_0.2s_ease-out] data-[state=closed]:animate-[slide-up_0.2s_ease-out] overflow-hidden mt-2">
              <Combobox
                placeholder="Select position..."
                optionList={positionList}
              />
            </CollapsibleContent>
          </Collapsible>

          <Collapsible className="w-full rounded-lg bg-white p-4 mt-4">
            <div className="flex flex-row justify-between">
              <span className="font-bold select-none">Branch</span>
              <CollapsibleTrigger asChild>
                <ChevronDown
                  color="black"
                  className="opacity-60 hover:opacity-100 cursor-pointer"
                />
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="data-[state=open]:animate-[slide-down_0.2s_ease-out] data-[state=closed]:animate-[slide-up_0.2s_ease-out] overflow-hidden mt-2">
              <Combobox
                placeholder="Select branch..."
                optionList={branchList}
              />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
