"use client";
import { Button } from "@/components/ui/button";

import SearchBar from "@/components/ui/searchbar";
import { AddNewGroupDialog } from "@/components/ui/staff_group_dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { randomUUID } from "crypto";
import { MinusSquare, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

const originalGroupList: TableRowProps[] = [
  {
    id: nanoid(),
    groupName: "Group 1",
    group: "Staff",
    note: "",
    operation: {
      remove: true,
      edit: true,
    },
  },
  {
    id: nanoid(),
    groupName: "Group 2",
    group: "Staff",
    note: "",
    operation: {
      remove: true,
      edit: true,
    },
  },
  {
    id: nanoid(),
    groupName: "Group 3",
    group: "Staff",
    note: "aaaaaaaaaaaaaaaaaaaa",
    operation: {
      remove: true,
      edit: true,
    },
  },
];

export type TableRowProps = {
  id: any;
  groupName: string;
  group: string;
  note: string;
  operation: {
    remove: boolean;
    edit: boolean;
  };
};

export default function StaffGroupPage() {
  const [groupList, setGroupList] = useState<TableRowProps[]>([
    ...originalGroupList,
  ]);
  const [open, setOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<TableRowProps | null>(null);
  const [filterList, setFilterList] = useState({});

  function handleCloseDialog() {
    setOpen(false);
    setGroupToEdit(null);
  }
  function handleFormSubmit(values: TableRowProps) {
    if (groupToEdit) {
      const index: number = groupList.indexOf(groupToEdit);
      if (index > -1) {
        const newGroupList = [...groupList];
        const editedGroup = {
          id: groupToEdit.id,
          groupName: values.groupName,
          group: "Staff",
          note: values.note,
          operation: {
            remove: true,
            edit: true,
          },
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
        operation: {
          remove: true,
          edit: true,
        },
      };
      setGroupList([...groupList, newGroup]);
    }
    handleCloseDialog();
  }
  function handleRemoveRow(id: number) {
    let newGroupList: TableRowProps[] = [];
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

  function handleEditRow(id: number) {
    const index: number = groupList.findIndex((group) => group.id === id);

    if (index > -1) {
      setGroupToEdit(groupList[index]);
    }
  }

  return (
    <div>
      <div className="flex flex-row justify-between mb-6">
        <div className="w-96">
          <div className="font-semibold mb-2 self-center">Search by name</div>
          <SearchBar />
        </div>

        <div className="self-start">
          <Button variant="default" onClick={() => setOpen(true)}>
            Add new group
          </Button>
        </div>
      </div>

      <AddNewGroupDialog
        open={open}
        data={groupToEdit}
        submit={handleFormSubmit}
        handleCloseDialog={handleCloseDialog}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Group Name</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Note</TableHead>
            <TableHead className="text-right">Operation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupList.map((group, index) => (
            <TableRow key={group.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{group.groupName}</TableCell>
              <TableCell>{group.group}</TableCell>
              <TableCell>{group.note}</TableCell>
              <TableCell className="flex flex-row justify-end text-right">
                {group.operation.edit ? (
                  <Pencil
                    size={20}
                    className="hover:cursor-pointer hover:opacity-70 ease-linear duration-200"
                    onClick={() => handleEditRow(group.id)}
                  />
                ) : null}
                {group.operation.remove ? (
                  <MinusSquare
                    className="text-red-500 ml-3 hover:cursor-pointer hover:opacity-70 ease-linear duration-200"
                    onClick={() => handleRemoveRow(group.id)}
                  />
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
