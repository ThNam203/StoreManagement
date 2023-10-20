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
import { Supplier } from "../props";
import { AddSupplierDialog } from "./add_supplier_dialog";
import { DataTable } from "./datatable";

const originalSupplierList: Supplier[] = [
  {
    id: nanoid(),
    name: "Nha cung cap Bánh gạo",
    phoneNumber: "0123456589",
    address: "111 ABC street",
    email: "abc@email.com",
    supplierGroup: "",
    image: "",
    description: "",
    companyName: "CTTNHH ABC",
    creator: "",
    createdDate: new Date().toLocaleDateString("en-GB"),
    status: "working",
    note: "",
  },
  {
    id: nanoid(),
    name: "Nha cung cấp nước ngọt",
    phoneNumber: "0123456589",
    address: "111 ABC street",
    email: "abc@email.com",
    supplierGroup: "",
    image: "",
    description: "",
    companyName: "CTTNHH ABC",
    creator: "",
    createdDate: new Date().toLocaleDateString("en-GB"),
    status: "working",
    note: "",
  },
  {
    id: nanoid(),
    name: "Nha cung cap Ngũ cốc",
    phoneNumber: "0123456589",
    address: "111 ABC street",
    email: "abc@email.com",
    supplierGroup: "",
    image: "",
    description: "",
    companyName: "CTTNHH ABC",
    creator: "",
    createdDate: new Date().toLocaleDateString("en-GB"),
    status: "working",
    note: "",
  },
];

const groupList = ["Family", "Single"];

export default function StaffInfoPage() {
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSupplierList(originalSupplierList);
  }, []);

  function handleFormSubmit(values: Supplier) {
    handleCloseDialog();
  }

  function handleCloseDialog() {
    setOpen(false);
  }

  return (
    <div className="flex flex-row h-screen p-6">
      <div className="w-[300px] h-full pr-6">
        <span className="text-slate-500 text-xl cursor-default select-none">
          Supplier
        </span>

        <div className="mt-7">
          <Collapsible className="rounded-lg bg-white p-4">
            <div className="flex flex-row justify-between">
              <span className="font-bold select-none">Supplier Group</span>
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

          {/* <Collapsible className="rounded-lg bg-white mt-4 p-4">
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
          </Collapsible> */}
        </div>
      </div>
      <div className="w-full">
        <AddSupplierDialog
          open={open}
          submit={handleFormSubmit}
          handleCloseDialog={handleCloseDialog}
        />

        <div className="mt-4 p-4 rounded-lg bg-white overflow-hidden">
          <DataTable data={supplierList} setOpenDialog={setOpen} />
        </div>
      </div>
    </div>
  );
}
