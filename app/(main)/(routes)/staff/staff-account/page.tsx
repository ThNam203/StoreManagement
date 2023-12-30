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
import {
  addStaff,
  deleteStaff,
  setStaffs,
  updateStaff,
} from "@/reducers/staffReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import StaffService from "@/services/staff_service";
import { handleMultipleFilter, handleRangeNumFilter } from "@/utils";
import {
  convertStaffReceived,
  convertStaffToSent,
} from "@/utils/staffApiUtils";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import { setPositions } from "@/reducers/staffPositionReducer";
import TransactionService from "@/services/transaction_service";
import { convertExpenseFormReceived } from "@/utils/transactionApiUtils";
import {
  addTransactions,
  setTransactions,
} from "@/reducers/transactionReducer";
import ShiftService from "@/services/shift_service";
import { convertShiftReceived } from "@/utils/shiftApiUtils";
import { setShifts } from "@/reducers/shiftReducer";
import { setDetailPunishAndBonusList } from "@/reducers/staffPunishAndRewardReducer";
import RoleService from "@/services/role_service";
import { setRoles } from "@/reducers/roleReducer";
import { convertRoleReceived } from "@/utils/roleSettingApiUtils";

export default function StaffInfoPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showPreloader());
      try {
        const resRole = await RoleService.getAllRoles();
        const roleReceived = resRole.data.map((role) =>
          convertRoleReceived(role),
        );
        dispatch(setRoles(roleReceived));

        const resStaff = await StaffService.getAllStaffs();
        const staffReceived = resStaff.data
          .map((staff) => convertStaffReceived(staff))
          .filter((staff) => staff.role !== "OWNER");
        dispatch(setStaffs(staffReceived));

        const resExpenseForm = await TransactionService.getAllExpenseForms();
        const expenseFormReceived = resExpenseForm.data.map((form) =>
          convertExpenseFormReceived(form),
        );
        dispatch(setTransactions(expenseFormReceived));

        const resShift = await ShiftService.getShiftsThisMonth();
        const shiftReceived = resShift.data.map((shift) =>
          convertShiftReceived(shift),
        );
        dispatch(setShifts(shiftReceived));

        const resDetailPunishAndBonus =
          await ShiftService.getPunishAndBonusList();
        const detailPunishAndBonusList = resDetailPunishAndBonus.data;
        dispatch(setDetailPunishAndBonusList(detailPunishAndBonusList));
      } catch (e) {
        axiosUIErrorHandler(e, toast);
      } finally {
        dispatch(disablePreloader());
      }
    };
    fetchData();
  }, []);

  const staffList = useAppSelector((state) => state.staffs.value);

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
      console.log("value to update", staffToSent);
      const dataForm: any = new FormData();
      dataForm.append(
        "data",
        new Blob([JSON.stringify(staffToSent)], { type: "application/json" }),
      );
      console.log("avatar to update", avatar);
      dataForm.append("file", avatar);
      console.log("dataForm", dataForm);
      const staffResult = await StaffService.updateStaff(
        staffToSent.id,
        dataForm,
      );
      const staffReceived = convertStaffReceived(staffResult.data);
      console.log("staffReceived", staffReceived);
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
      console.log("res", res);
      const salaryDebt = res.data.salaryDebt;
      dispatch(updateStaff({ ...filterdStaffList[rowIndex], salaryDebt }));

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
