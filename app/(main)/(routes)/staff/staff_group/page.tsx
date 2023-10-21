"use client";

import { DataTable } from "@/app/(main)/(routes)/staff/staff_group/datatable";
import { DatePicker } from "@/components/ui/datepicker";
import { Bell } from "lucide-react";
import { nanoid } from "nanoid";
import { ChangeEvent, useEffect, useState } from "react";
import { StaffGroup } from "../props";
import { AddGroupDialog } from "./add_staff_group_dialog";

const originalGroupList: StaffGroup[] = [
  {
    id: nanoid(),
    groupName: "Group 1",
    group: "Staff",
    note: "This is group 1",
  },
  {
    id: nanoid(),
    groupName: "Group 2",
    group: "Staff",
    note: "This is group 2",
  },
  {
    id: nanoid(),
    groupName: "Group 3",
    group: "Staff",
    note: "This is group 3",
  },
];

export default function StaffGroupPage() {
  const [groupList, setGroupList] = useState<StaffGroup[]>(originalGroupList);
  const [open, setOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<StaffGroup | null>(null);
  const [filterList, setFilterList] = useState({});

  function handleCloseDialog() {
    setOpen(false);
    setGroupToEdit(null);
  }
  function handleFormSubmit(values: StaffGroup) {
    if (groupToEdit) {
      const index: number = groupList.indexOf(groupToEdit);
      if (index > -1) {
        const newGroupList = [...groupList];
        const editedGroup = {
          id: groupToEdit.id,
          groupName: values.groupName,
          group: "Staff",
          note: values.note,
        };

        newGroupList.splice(index, 1, editedGroup);
        setGroupList(newGroupList);
      }
    } else {
      const newGroup = {
        id: nanoid(),
        groupName: values.groupName,
        group: "Staff",
        note: values.note,
      };
      setGroupList([...groupList, newGroup]);
    }
    handleCloseDialog();
  }
  function handleRemoveRow(id: any) {
    let newGroupList: StaffGroup[] = [];
    groupList.forEach((group) => {
      if (group.id !== id) newGroupList.push(group);
    });

    setGroupList(newGroupList);
  }

  useEffect(() => {
    if (groupToEdit) {
      setOpen(true);
    }
  }, [groupToEdit]);

  function handleEditRow(id: any) {
    const index: number = groupList.findIndex((group) => group.id === id);

    if (index > -1) {
      setGroupToEdit(groupList[index]);
    }
  }
  function handleSelectAll() {}
  function handleSelectARow(event: ChangeEvent) {
    const tableRow = event.target.closest("TableRow");

    tableRow?.setAttribute(
      "data-state",
      event.target.ariaChecked ? "selected" : ""
    );
  }

  return (
    <div className="h-screen">
      <div className="w-full h-16 bg-white flex flex-row items-center justify-between px-20">
        <div>
          <span className="text-slate-500 text-xl">Staff Group</span>
        </div>
        <div className="flex flex-row items-center">
          <div className="w-[300px]">
            <DatePicker />
          </div>
          <div className="relative hover:opacity-70 ease-linear duration-200 cursor-pointer">
            <Bell className="ml-6 " />
            <span className="absolute -top-2 -right-2 w-5 h-5 leading-[1.25rem] rounded-full bg-blue-800 text-white text-xs flex items-center justify-center">
              10
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white m-6 p-6 rounded-lg">
        <DataTable data={groupList} setOpenDialog={setOpen} />
        <AddGroupDialog
          open={open}
          data={groupToEdit}
          submit={handleFormSubmit}
          handleCloseDialog={handleCloseDialog}
        />
      </div>
    </div>
  );
}
