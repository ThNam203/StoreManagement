"use client";

import { PageWithFilters, SearchFilter } from "@/components/ui/filter";
import { Staff } from "@/entities/Staff";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { handleMultipleFilter } from "@/utils";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import StaffService from "@/services/staff_service";
import { addStaff } from "@/reducers/staffReducer";
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
    const staffResult = await StaffService.createNewStaff(value);
    dispatch(addStaff(staffResult.data));
    try {
      const staffResult = await StaffService.createNewStaff(value);
      dispatch(addStaff(staffResult.data));
      console.log("return", staffResult.data);
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const handleFormSubmit = async (value: Staff) => {
    try {
      addNewStaff(value);
    } catch (e) {
      console.log(e);
    }
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
      <DataTable data={filterdStaffList} onSubmit={handleFormSubmit} />
    </PageWithFilters>
  );
}
