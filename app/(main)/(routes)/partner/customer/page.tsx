"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { nanoid } from "nanoid";

import { Combobox } from "@/components/ui/combobox";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import { Customer } from "../props";
import { AddCustomerDialog } from "./add_customer_dialog";

const originalCustomerList: Customer[] = [
  {
    id: nanoid(),
    name: "David Silva",
    customerGroup: "Family",
    phoneNumber: "0123456789",
    address: "222 ABC Street",
    sex: "male",
    email: "david@gmail.com",
    birthday: "1/1/1980",
    image: "",
    description: "",
    creator: "",
    createdDate: new Date().toLocaleDateString("en-GB"),
    status: "working",
    note: "",
  },
  {
    id: nanoid(),
    name: "Pep GuardDiola",
    customerGroup: "Single",
    phoneNumber: "0123456788",
    address: "221 ABC Street",
    sex: "female",
    email: "pep@gmail.com",
    birthday: "1/1/1981",
    image: "",
    description: "",
    creator: "",
    createdDate: new Date().toLocaleDateString("en-GB"),
    status: "working",
    note: "",
  },
  {
    id: nanoid(),
    name: "Harry Maguire",
    customerGroup: "Single",
    phoneNumber: "0123456787",
    address: "22 ABC Street",
    sex: "male",
    email: "harry@gmail.com",
    birthday: "1/1/1990",
    image: "",
    description: "",
    creator: "",
    createdDate: new Date().toLocaleDateString("en-GB"),
    status: "not working",
    note: "",
  },
];

const groupList = ["Family", "Single"];

const branchList = ["Center Branch", "Branch 1", "Branch 2", "Branch 3"];

export default function StaffInfoPage() {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCustomerList(originalCustomerList);
  }, []);

  function handleFormSubmit(values: Customer) {}

  function handleCloseDialog() {
    setOpen(false);
  }

  return (
    <div className="flex flex-row h-screen p-6">
      <div className="w-[300px] h-full pr-6">
        <span className="text-slate-500 text-xl cursor-default select-none">
          Customer
        </span>

        <div className="mt-7">
          <Collapsible className="rounded-lg bg-white p-4">
            <div className="flex flex-row justify-between">
              <span className="font-bold select-none">Customer Group</span>
              <CollapsibleTrigger asChild>
                <ChevronDown
                  color="black"
                  className="opacity-60 hover:opacity-100 cursor-pointer"
                />
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="data-[state=open]:animate-[slide-down_0.2s_ease-out] data-[state=closed]:animate-[slide-up_0.2s_ease-out] overflow-hidden mt-2">
              <Combobox placeholder="Select group..." optionList={groupList} />
            </CollapsibleContent>
          </Collapsible>

          <Collapsible className="rounded-lg bg-white mt-4 p-4">
            <div className="flex flex-row justify-between">
              <span className="font-bold select-none">Created Date</span>
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
      <div className="w-full">
        <AddCustomerDialog
          open={open}
          submit={handleFormSubmit}
          handleCloseDialog={handleCloseDialog}
        />

        <div className="mt-4 p-4 rounded-lg bg-white overflow-hidden">
          <DataTable data={customerList} setOpenDialog={setOpen} />
        </div>
      </div>
    </div>
  );
}
