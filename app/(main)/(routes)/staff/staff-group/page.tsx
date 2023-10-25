"use client";

import { DataTable } from "@/app/(main)/(routes)/staff/staff-group/datatable";
import { DatePicker } from "@/components/ui/datepicker";
import { Bell } from "lucide-react";
import { nanoid } from "nanoid";
import { ChangeEvent, useEffect, useState } from "react";
import { StaffGroup } from "../../../../../entities/Staff";
import { AddGroupDialog } from "./add_staff_group_dialog";

const originalGroupList: StaffGroup[] = [
  {
    id: nanoid(),
    groupName: "Group 1",
    note: "This is group 1",
  },
  {
    id: nanoid(),
    groupName: "Group 2",
    note: "This is group 2",
  },
  {
    id: nanoid(),
    groupName: "Group 3",
    note: "This is group 3",
  },
];

export default function StaffGroupPage() {
  const [groupList, setGroupList] = useState<StaffGroup[]>(originalGroupList);
  const [groupToEdit, setGroupToEdit] = useState<StaffGroup | null>(null);
  const [filterList, setFilterList] = useState({});

  function handleFormSubmit(values: StaffGroup) {
    // if (groupToEdit) {
    //   const index: number = groupList.indexOf(groupToEdit);
    //   if (index > -1) {
    //     const newGroupList = [...groupList];
    //     const editedGroup = {
    //       id: groupToEdit.id,
    //       groupName: values.groupName,
    //       note: values.note,
    //     };

    //     newGroupList.splice(index, 1, editedGroup);
    //     setGroupList(newGroupList);
    //   }
    // } else {
    //   const newGroup = {
    //     id: nanoid(),
    //     groupName: values.groupName,
    //     note: values.note,
    //   };
    //   setGroupList((prev) => [...prev, newGroup]);
    // }
    setGroupList((prev) => [...prev, values]);
  }

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-start-1 col-span-6">
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-start font-semibold text-3xl my-4">
            Staff Group
          </h2>
          <DataTable data={groupList} onSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>

    // <div className="h-screen">
    //   <div className="w-full h-16 bg-white flex flex-row items-center justify-between px-20">
    //     <div>

    //     </div>
    //     <div className="flex flex-row items-center">
    //       <div className="w-[300px]">
    //         <DatePicker />
    //       </div>
    //       <div className="relative hover:opacity-70 ease-linear duration-200 cursor-pointer">
    //         <Bell className="ml-6 " />
    //         <span className="absolute -top-2 -right-2 w-5 h-5 leading-[1.25rem] rounded-full bg-blue-800 text-white text-xs flex items-center justify-center">
    //           10
    //         </span>
    //       </div>
    //     </div>
    //   </div>

    // </div>
  );
}
