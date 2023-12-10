"use client";

import { PageWithFilters, SearchFilter } from "@/components/ui/filter";
import { Staff } from "@/entities/Staff";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { handleMultipleFilter } from "@/utils";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import StaffService from "@/services/staff_service";
import { addStaff, deleteStaff, updateStaff } from "@/reducers/staffReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { add } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import {
  convertStaffReceived,
  convertStaffToSent,
} from "@/utils/staffApiUtils";

export default function StaffInfoPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const staffList = useAppSelector((state) => state.staffs.value);

  const [filterdStaffList, setFilteredStaffList] = useState<Staff[]>([]);
  const [multiFilter, setMultiFilter] = useState({
    position: [] as string[],
  });

  useEffect(() => {
    var filteredList = [...staffList];
    filteredList = handleMultipleFilter(multiFilter, filteredList);

    setFilteredStaffList([...filteredList]);
  }, [multiFilter, staffList]);

  const addNewStaff = async (value: Staff, avatar: File | null) => {
    try {
      const staffToSent = convertStaffToSent(value);
      const dataForm: any = new FormData();
      dataForm.append(
        "data",
        new Blob([JSON.stringify(staffToSent)], { type: "application/json" })
      );
      dataForm.append("file", avatar);

      const staffResult = await StaffService.createNewStaff(dataForm);
      const staffReceived = convertStaffReceived(staffResult.data);
      dispatch(addStaff(staffReceived));
      return Promise.resolve();
    } catch (e) {
      console.log(e);
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const updateAStaff = async (value: Staff, avatar: File | null) => {
    try {
      const staffToSent = convertStaffToSent(value);
      const dataForm: any = new FormData();
      dataForm.append(
        "data",
        new Blob([JSON.stringify(staffToSent)], { type: "application/json" })
      );
      dataForm.append("file", avatar);
      const staffResult = await StaffService.updateStaff(
        staffToSent.id,
        dataForm
      );
      const staffReceived = convertStaffReceived(staffResult.data);
      dispatch(updateStaff(staffReceived));
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

  const handleFormSubmit = (value: Staff, avatar: File | null) => {
    const index = staffList.findIndex((staff) => staff.id === value.id);
    if (index !== -1) {
      return handleUpdateStaff(value, avatar);
    } else return addNewStaff(value, avatar);
  };
  const handleDeleteStaff = (index: number) => {
    const id = filterdStaffList[index].id;
    deleteAStaff(id);
  };

  const handleUpdateStaff = (value: Staff, avatar: File | null) => {
    return updateAStaff(value, avatar);
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
