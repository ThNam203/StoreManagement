"use client";

import {
  PageWithFilters,
  RangeFilter,
  SearchFilter,
} from "@/components/ui/filter";
import { useToast } from "@/components/ui/use-toast";
import { Staff } from "@/entities/Staff";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { setShifts } from "@/reducers/shiftReducer";
import { setDetailPunishAndBonusList } from "@/reducers/staffPunishAndRewardReducer";
import {
  addStaff,
  deleteStaff,
  setStaffs,
  updateStaff,
} from "@/reducers/staffReducer";
import { setTransactions } from "@/reducers/transactionReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import ShiftService from "@/services/shift_service";
import StaffService from "@/services/staff_service";
import TransactionService from "@/services/transaction_service";
import { handleMultipleFilter, handleRangeNumFilter } from "@/utils";
import { convertShiftReceived } from "@/utils/shiftApiUtils";
import {
  convertStaffReceived,
  convertStaffToSent,
} from "@/utils/staffApiUtils";
import { convertExpenseFormReceived } from "@/utils/transactionApiUtils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";

export default function StaffInfoPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showPreloader());
      try {
        const resStaff = await StaffService.getAllStaffs();
        dispatch(
          setStaffs(
            resStaff.data.filter((staff) => staff.position !== "Owner"),
          ),
        );

        const resExpenseForm = await TransactionService.getAllExpenseForms();
        const expenseFormReceived = resExpenseForm.data.map((form) =>
          convertExpenseFormReceived(form),
        );
        dispatch(setTransactions(expenseFormReceived));

        const resShift = await ShiftService.getShiftsThisMonth();

        dispatch(setShifts(resShift.data));

        const resDetailPunishAndBonus =
          await ShiftService.getPunishAndBonusList();
        dispatch(setDetailPunishAndBonusList(resDetailPunishAndBonus.data));
      } catch (e) {
        axiosUIErrorHandler(e, toast, router);
      } finally {
        dispatch(disablePreloader());
      }
    };
    fetchData();
  }, []);

  const staffList = useAppSelector((state) => state.staffs.activeStaffs);

  const [filterdStaffList, setFilteredStaffList] = useState<Staff[]>([]);
  const [multiFilter, setMultiFilter] = useState({
    position: [] as string[],
  });
  const [rangeNumFilter, setRangeNumFilter] = useState({
    salaryDebt: {
      startValue: NaN,
      endValue: NaN,
    },
  });

  useEffect(() => {
    var filteredList = [...staffList];
    filteredList = handleMultipleFilter(multiFilter, filteredList);
    filteredList = handleRangeNumFilter(rangeNumFilter, filteredList);

    setFilteredStaffList([...filteredList]);
  }, [multiFilter, rangeNumFilter, staffList]);

  const addNewStaff = async (value: Staff, avatar: File | null) => {
    try {
      const staffToSent = convertStaffToSent(value);
      const dataForm: any = new FormData();
      dataForm.append(
        "data",
        new Blob([JSON.stringify(staffToSent)], { type: "application/json" }),
      );
      dataForm.append("file", avatar);

      const resStaff = await StaffService.createNewStaff(dataForm);
      dispatch(addStaff(resStaff.data));
      return Promise.resolve();
    } catch (e) {
      console.log(e);
      axiosUIErrorHandler(e, toast, router);
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

      const resStaff = await StaffService.updateStaff(staffToSent.id, dataForm);
      dispatch(updateStaff(resStaff.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject(e);
    }
  };

  const deleteAStaff = async (id: number) => {
    try {
      await StaffService.deleteStaff(id);
      dispatch(deleteStaff(id));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject(e);
    }
  };

  const handleFormSubmit = (value: Staff, avatar: File | null) => {
    const index = staffList.findIndex((staff) => staff.id === value.id);
    if (index !== -1) return handleUpdateStaff(value, avatar);
    return handleAddNewStaff(value, avatar);
  };
  const handleDeleteStaff = (index: number) => {
    const id = filterdStaffList[index].id;
    deleteAStaff(id).then(() => {
      toast({
        variant: "default",
        title: "Delete staff successfully",
      });
    });
  };

  const handleUpdateStaff = (value: Staff, avatar: File | null) => {
    return updateAStaff(value, avatar).then(() => {
      toast({
        variant: "default",
        title: "Update staff successfully",
      });
    });
  };
  const handleAddNewStaff = (value: Staff, avatar: File | null) => {
    return addNewStaff(value, avatar).then(() => {
      toast({
        variant: "default",
        title: "Add staff successfully",
      });
    });
  };

  const updatePositionMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, position: values }));
  };
  const updateSalaryDebtRangeNumFilter = (range: {
    startValue: number;
    endValue: number;
  }) => {
    console.log("range", range);
    setRangeNumFilter((prev) => ({ ...prev, salaryDebt: range }));
  };

  const handleCalculateSalary = async (rowIndex: number) => {
    try {
      const res = await StaffService.calculateSalary(
        filterdStaffList[rowIndex].id,
      );
      dispatch(updateStaff(res.data));

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
      <RangeFilter
        title="Salary debt"
        range={rangeNumFilter.salaryDebt}
        onValuesChanged={updateSalaryDebtRangeNumFilter}
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
