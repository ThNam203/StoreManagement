"use client";

import { PageWithFilters, SearchFilter } from "@/components/ui/filter";
import { useToast } from "@/components/ui/use-toast";
import { Staff } from "@/entities/Staff";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import {
  addStaff,
  deleteStaff,
  setStaffs,
  updateStaff,
} from "@/reducers/staffReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import StaffService from "@/services/staff_service";
import { handleMultipleFilter } from "@/utils";
import {
  convertStaffReceived,
  convertStaffToSent,
} from "@/utils/staffApiUtils";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import { setPositions } from "@/reducers/staffPositionReducer";

export default function StaffInfoPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const fetchStaffList = async () => {
    dispatch(showPreloader());
    try {
      const res = await StaffService.getAllStaffs();
      const staffReceived = res.data.map((staff) =>
        convertStaffReceived(staff),
      );
      dispatch(setStaffs(staffReceived));
    } catch (e) {
      axiosUIErrorHandler(e, toast);
    } finally {
      dispatch(disablePreloader());
    }
  };
  const fetchStaffPositionList = async () => {
    try {
      const res = await StaffService.getAllPositions();
      dispatch(setPositions(res.data));
    } catch (e) {
      axiosUIErrorHandler(e, toast);
    }
  };
  useEffect(() => {
    fetchStaffPositionList();
    fetchStaffList();
  }, []);

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
        new Blob([JSON.stringify(staffToSent)], { type: "application/json" }),
      );
      dataForm.append("file", avatar);

      const staffResult = await StaffService.createNewStaff(dataForm);
      const staffReceived = convertStaffReceived(staffResult.data);
      dispatch(addStaff(staffReceived));
      return Promise.resolve();
    } catch (e) {
      console.log(e);
      axiosUIErrorHandler(e, toast);
      return Promise.reject(e);
    }
  };

  const updateAStaff = async (value: Staff, avatar: File | null) => {
    try {
      const staffToSent = convertStaffToSent(value);
      const dataForm: any = new FormData();
      dataForm.append(
        "data",
        new Blob([JSON.stringify(staffToSent)], { type: "application/json" }),
      );
      console.log("avatar to update", avatar);
      dataForm.append("file", avatar);
      const staffResult = await StaffService.updateStaff(
        staffToSent.id,
        dataForm,
      );
      const staffReceived = convertStaffReceived(staffResult.data);
      dispatch(updateStaff(staffReceived));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject(e);
    }
  };

  const deleteAStaff = async (id: number) => {
    try {
      await StaffService.deleteStaff(id);
      dispatch(deleteStaff(id));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject(e);
    }
  };

  const handleFormSubmit = (value: Staff, avatar: File | null) => {
    const index = staffList.findIndex((staff) => staff.id === value.id);
    if (index !== -1) {
      console.log("update");
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

  const handleCalculateSalary = async (rowIndex: number) => {
    try {
      const res = await StaffService.calculateSalary(
        filterdStaffList[rowIndex].id,
      );
      console.log("res", res);
      const salaryDebt = res.data.salaryDebt;
      await updateAStaff({ ...filterdStaffList[rowIndex], salaryDebt }, null);

      console.log("salaryDebt", salaryDebt);
      return Promise.resolve();
    } catch (e) {
      console.log(e);
      return Promise.reject();
    }
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
        onStaffCalculateSalaryButtonClicked={handleCalculateSalary}
      />
    </PageWithFilters>
  );
}
