"use client";

import { PageWithFilters, SearchFilter } from "@/components/ui/filter";
import { Staff } from "@/entities/Staff";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  convertStaffReceived,
  convertStaffToSent,
  handleMultipleFilter,
} from "@/utils";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import StaffService from "@/services/staff_service";
import { addStaff, deleteStaff, updateStaff } from "@/reducers/staffReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { add } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export default function StaffInfoPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const staffList = useAppSelector((state) => state.staffs.value);
  console.log("staffList", staffList);

  const [filterdStaffList, setFilteredStaffList] = useState<Staff[]>([]);
  const [multiFilter, setMultiFilter] = useState({
    position: [] as string[],
  });

  useEffect(() => {
    var filteredList = [...staffList];
    filteredList = handleMultipleFilter(multiFilter, filteredList);

    setFilteredStaffList([...filteredList]);
  }, [multiFilter, staffList]);

  const addNewStaff = async (value: Staff) => {
    try {
      const staffToSent = convertStaffToSent(value);
      const dataForm: any = new FormData();
      dataForm.append(
        "data",
        new Blob([JSON.stringify(staffToSent)], { type: "application/json" })
      );
      dataForm.append("file", null);

      const staffResult = await StaffService.createNewStaff(dataForm);
      const staffReceived = convertStaffReceived(staffResult.data);
      dispatch(addStaff(staffReceived));
      console.log("return", staffResult.data);
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const updateAStaff = async (value: Staff) => {
    try {
      const staffToSent = convertStaffToSent(value);
      const dataForm: any = new FormData();
      dataForm.append(
        "data",
        new Blob([JSON.stringify(staffToSent)], { type: "application/json" })
      );
      dataForm.append("file", null);
      console.log("dataForm", dataForm);
      const staffResult = await StaffService.updateStaff(
        staffToSent.id,
        dataForm
      );
      const staffReceived = convertStaffReceived(staffResult.data);
      dispatch(updateStaff(staffReceived));
      console.log("return", staffResult.data);
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const deleteAStaff = async (id: number) => {
    try {
      await StaffService.deleteStaff(id);
      dispatch(deleteStaff(id));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const handleFormSubmit = (value: Staff) => {
    const index = staffList.findIndex((staff) => staff.id === value.id);
    if (index !== -1) {
      handleUpdateStaff(value);
    } else addNewStaff(value);
  };
  const handleDeleteStaff = (index: number) => {
    const id = filterdStaffList[index].id;
    deleteAStaff(id);
  };

  const handleUpdateStaff = (value: Staff) => {
    console.log("update", value);
    updateAStaff(value);
  };

  const updatePositionMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, position: values }));
  };

  const filters: JSX.Element[] = [
    <div key={1} className="flex flex-col space-y-2">
      <SearchFilter
        key={1}
        title="Position"
        placeholder="Search position"
        chosenValues={multiFilter.position}
        choices={Array.from(new Set(staffList.map((staff) => staff.position)))}
        onValuesChanged={updatePositionMultiFilter}
      />
    </div>,
  ];

  return (
    <PageWithFilters title="Staff" filters={filters}>
      <DataTable
        data={filterdStaffList}
        onSubmit={handleFormSubmit}
        onStaffDeleteButtonClicked={handleDeleteStaff}
      />
    </PageWithFilters>
  );
}
