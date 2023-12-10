"use client";

import { Button } from "@/components/ui/button";
import {
  FilterDay,
  FilterMonth,
  FilterTime,
  FilterWeek,
} from "@/components/ui/filter";
import { Input } from "@/components/ui/input";
import { TimeFilterType, formatID, getStaticRangeFilterTime } from "@/utils";
import { AlignJustify, FileDown, Filter, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { DisplayType, Table } from "./attendance_table";
import { ButtonGroup } from "./button_group";
import { MyDateRangePicker } from "./my_date_range_picker";
import { SetTimeDialog } from "./set_time_dialog";
import { set } from "date-fns";
import { el, fi } from "date-fns/locale";
import { Sex, Staff } from "@/entities/Staff";
import { BonusUnit, SalaryType } from "@/entities/SalarySetting";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { DailyShift, Shift } from "@/entities/Attendance";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import ShiftService from "@/services/shift_service";
import {
  addDailyShift,
  addDailyShifts,
  addShift,
  deleteDailyShift,
  deleteShift,
  setShifts,
  updateDailyShift,
  updateShift,
} from "@/reducers/shiftReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useToast } from "@/components/ui/use-toast";
import {
  convertDailyShiftReceived,
  convertDailyShiftToSent,
  convertShiftReceived,
  convertShiftToSent,
} from "@/utils/shiftApiUtils";
import { off } from "process";
import LoadingCircle from "@/components/ui/loading_circle";
import { cn } from "@/lib/utils";

export default function Attendance() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [range, setRange] = useState<{ startDate: Date; endDate: Date }>(
    getStaticRangeFilterTime(FilterWeek.ThisWeek)
  );
  const [displayType, setDisplayType] = useState<DisplayType>("Week");
  const [openSetTimeDialog, setOpenSetTimeDialog] = useState(false);

  const table = useAppSelector((state) => state.shift.value);
  const staffList = useAppSelector((state) => state.staffs.value);
  const [isLoading, setIsLoading] = useState(false);

  const getShiftsByRange = async (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setIsLoading(true);
    try {
      const resShiftList = await ShiftService.getShiftsByRange(range);
      let shiftList: Shift[] = [];
      resShiftList.data.forEach((shift) => {
        shiftList.push(convertShiftReceived(shift));
      });
      dispatch(setShifts(shiftList));
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    } finally {
      setIsLoading(false);
    }
  };
  const getShiftsThisMonth = async () => {
    try {
      const resShiftList = await ShiftService.getShiftsThisMonth();
      let shiftList: Shift[] = [];
      resShiftList.data.forEach((shift) => {
        shiftList.push(convertShiftReceived(shift));
      });
      dispatch(setShifts(shiftList));
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRangeTimeFilterChange = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRange(range);
    setDisplayType("Custom");
    getShiftsByRange(range);
  };
  const handleStaticRangeFilterChange = (value: string) => {
    if (value === "Day") setRange(getStaticRangeFilterTime(FilterDay.Today));
    else if (value === "Week")
      setRange(getStaticRangeFilterTime(FilterWeek.ThisWeek));
    else setRange(getStaticRangeFilterTime(FilterMonth.ThisMonth));
    setDisplayType(value as DisplayType);
    if (displayType === "Custom") getShiftsThisMonth();
  };
  const AddShift = async (shift: Shift) => {
    try {
      const newShift = convertShiftToSent(shift);
      console.log("to sent", newShift);
      const res = await ShiftService.createShift(newShift);
      const result = convertShiftReceived(res.data);
      console.log("received", result);
      dispatch(addShift(result));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };
  const UpdateShift = async (id: any, shift: Shift) => {
    try {
      const newShift = convertShiftToSent(shift);
      const res = await ShiftService.updateShift(id, newShift);
      const result = convertShiftReceived(res.data);
      dispatch(updateShift(result));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const AddDailyShifts = async (dailyShiftList: DailyShift[]) => {
    try {
      const newDailyShiftList = dailyShiftList.map((dailyShift) =>
        convertDailyShiftToSent(dailyShift)
      );
      console.log("to sent", newDailyShiftList);
      const res = await ShiftService.createDailyShifts(newDailyShiftList);
      console.log("received", res.data);
      const result = res.data.map((dailyShift: any) =>
        convertDailyShiftReceived(dailyShift)
      );
      dispatch(addDailyShifts(result));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };
  const UpdateDailyShift = async (dailyShift: DailyShift) => {
    try {
      const newDailyShift = convertDailyShiftToSent(dailyShift);
      const res = await ShiftService.updateDailyShift(
        dailyShift.id,
        newDailyShift
      );
      if (res.data) {
        const result = convertDailyShiftReceived(res.data);
        dispatch(updateDailyShift(result));
      } else {
        dispatch(deleteDailyShift(dailyShift));
      }
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };
  const handleUpdateShift = (value: Shift) => {
    const index = table.findIndex((shift) => shift.id === value.id);
    if (index !== -1) {
      return UpdateShift(value.id, value);
    } else {
      return AddShift(value);
    }
  };
  const handleRemoveShift = async (id: any) => {
    try {
      await ShiftService.deleteShift(id);
      dispatch(deleteShift(id));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject();
    }
  };

  const handleAddDailyShift = (value: DailyShift[]) => {
    return AddDailyShifts(value);
  };
  const handleUpdateDailyShift = (value: DailyShift) => {
    return UpdateDailyShift(value);
  };

  return (
    <div className="text-sm flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <MyDateRangePicker
            rangeTimeValue={range}
            onRangeTimeFilterChanged={handleRangeTimeFilterChange}
          />
          <ButtonGroup
            choices={["Day", "Week", "Month"]}
            defaultValue="Week"
            onValueChange={handleStaticRangeFilterChange}
          />
          <div className={cn(isLoading ? "visible" : "hidden")}>Loading</div>
          {isLoading ? <LoadingCircle className="bg-red-500" /> : null}
        </div>
        <div className="flex flex-row items-center gap-4">
          <Button
            variant={"green"}
            className="gap-2"
            onClick={() => setOpenSetTimeDialog(true)}
          >
            <Plus size={16} />
            <span>Set time</span>
          </Button>
          <Button variant={"green"} className="gap-2">
            <FileDown className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <Table
        staffList={staffList}
        rangeDate={range}
        shiftList={table}
        displayType={displayType}
        onUpdateShift={handleUpdateShift}
        onSetTime={handleAddDailyShift}
        onRemoveShift={handleRemoveShift}
        onUpdateDailyShift={handleUpdateDailyShift}
      />
      <SetTimeDialog
        open={openSetTimeDialog}
        setOpen={setOpenSetTimeDialog}
        shiftList={table}
        staffList={staffList}
        specificShift={null}
        submit={handleAddDailyShift}
      />
    </div>
  );
}
