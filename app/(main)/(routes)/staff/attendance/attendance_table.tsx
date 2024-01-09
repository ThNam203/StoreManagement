"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  AttendanceRecord,
  DailyShift,
  Shift,
  Status,
} from "@/entities/Attendance";
import { Staff } from "@/entities/Staff";
import { cn } from "@/lib/utils";
import { createRangeDate } from "@/utils";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Pencil, PlusCircle } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AddShiftDialog } from "../../../../../components/ui/attendance/add_shift_dialog";
import { SetTimeDialog } from "../../../../../components/ui/attendance/set_time_dialog";
import { TimeKeepingDialog } from "./timekeeping_dialog";
import { useAppSelector } from "@/hooks";
const borderStyle = "border border-gray-100 border-[1px]";
const HeaderCellStyleWeek =
  "xl:w-[calc(100%/8)] max-2xl:w-40 h-10" + " " + borderStyle;
const CellStyleWeek =
  "xl:w-[calc(100%/8)] max-2xl:w-40 h-44" + " " + borderStyle;
const HeaderCellStyleMonth = "w-40 h-10" + " " + borderStyle;
const CellStyleMonth = "w-40 h-44" + " " + borderStyle;

let HeaderCellStyle = "";
let CellStyle = "";
export type DisplayType = "Day" | "Week" | "Month" | "Custom";

const AttendanceTable = ({
  shiftList,
  rangeDate,
  displayType = "Week",
  staffList,
  onUpdateShift,
  onRemoveShift,
  onSetTime,
  onUpdateDailyShifts,
  canCreateAttendance = false,
  canUpdateAttendance = false,
  canDeleteAttendance = false,
}: {
  shiftList: Shift[];
  rangeDate: { startDate: Date; endDate: Date };
  displayType?: DisplayType;
  staffList: Staff[];
  onUpdateShift?: (values: Shift) => any;
  onRemoveShift?: (id: any) => any;
  onSetTime?: (values: DailyShift[]) => any;
  onUpdateDailyShifts?: (values: DailyShift[]) => any;
  canCreateAttendance?: boolean;
  canUpdateAttendance?: boolean;
  canDeleteAttendance?: boolean;
}) => {
  if (displayType === "Month" || displayType === "Custom") {
    HeaderCellStyle = HeaderCellStyleMonth;
    CellStyle = CellStyleMonth;
  } else {
    HeaderCellStyle = HeaderCellStyleWeek;
    CellStyle = CellStyleWeek;
  }
  const [data, setData] = useState<Shift[]>([]);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [openAddShiftDialog, setOpenAddShiftDialog] = useState<boolean>(false);
  const [selectedDailyShift, setSelectedDailyShift] =
    useState<DailyShift | null>(null);
  const [openSetTimeDialog, setOpenSetTimeDialog] = useState<boolean>(false);
  const [selectedAttendance, setSelectedAttendance] =
    useState<AttendanceRecord | null>(null);
  const [openTimeKeepingDialog, setOpenTimeKeepingDialog] =
    useState<boolean>(false);

  const handleOpenAddShiftDialog = (shift: Shift | null) => {
    setSelectedShift(shift);
    setOpenAddShiftDialog(true);
  };
  const handleOpenSetTimeDialog = (dailyShift: DailyShift | null) => {
    setSelectedDailyShift(dailyShift);
    setOpenSetTimeDialog(true);
  };
  const handleOpenTimeKeepingDialog = (
    attendance: AttendanceRecord,
    dailyShift: DailyShift,
  ) => {
    setSelectedAttendance(attendance);
    setSelectedDailyShift(dailyShift);
    setOpenTimeKeepingDialog(true);
  };

  useEffect(() => {
    const sortedData = [...shiftList];
    sortedData.sort(
      (a, b) => a.workingTime.start.getTime() - b.workingTime.start.getTime(),
    );
    setData(sortedData);
    console.log("table", sortedData);
  }, [shiftList]);

  return (
    <div
      className={cn(
        "w-full overflow-y-hidden overflow-x-scroll rounded-md shadow",
      )}
    >
      <table className="w-full bg-white">
        <tr>
          <AttendanceHeaderRow
            range={rangeDate}
            displayType={displayType}
            handleOpenShiftDialog={handleOpenAddShiftDialog}
            canCreateAttendance={canCreateAttendance}
          />
        </tr>
        {data.length === 0 && (
          <tr>
            <Image
              alt="No shift found"
              width={300}
              height={200}
              src={"/no-shift-found.png"}
              className="mx-auto object-contain"
            />
          </tr>
        )}
        {data.map((shift, index) => {
          return (
            <tr key={shift.name + index}>
              <AttendanceDataRow
                shift={shift}
                rangeDate={rangeDate}
                displayType={displayType}
                canUpdateAttendance={canUpdateAttendance}
                canDeleteAttendance={canDeleteAttendance}
                handleOpenSetTimeDialog={handleOpenSetTimeDialog}
                handleOpenShiftDialog={handleOpenAddShiftDialog}
                handleOpenTimeKeepingDialog={handleOpenTimeKeepingDialog}
              />
            </tr>
          );
        })}
      </table>
      <AddShiftDialog
        shift={selectedShift}
        open={openAddShiftDialog}
        setOpen={setOpenAddShiftDialog}
        submit={onUpdateShift}
        onRemoveShift={onRemoveShift}
        canDelete={canDeleteAttendance}
      />
      <SetTimeDialog
        open={openSetTimeDialog}
        setOpen={setOpenSetTimeDialog}
        shiftList={data}
        staffList={staffList}
        specificShift={selectedDailyShift}
        submit={onSetTime}
        onUpdateDailyShifts={onUpdateDailyShifts}
      />
      <TimeKeepingDialog
        open={openTimeKeepingDialog}
        setOpen={setOpenTimeKeepingDialog}
        attendanceRecord={selectedAttendance}
        dailyShift={selectedDailyShift}
        canUpdateAttendance={canUpdateAttendance}
        canDeleteAttendance={canDeleteAttendance}
        onRemoveAttendanceRecord={(attendanceRecord) => {
          if (!selectedDailyShift) return;
          const newDailyShift: DailyShift = { ...selectedDailyShift };
          if (newDailyShift.attendList) {
            newDailyShift.attendList = newDailyShift.attendList.filter(
              (attend) =>
                attend.date.toLocaleDateString() !==
                  attendanceRecord.date.toLocaleDateString() ||
                attend.staffId !== attendanceRecord.staffId,
            );
          }
          console.log("newDailyShift", newDailyShift);
          if (onUpdateDailyShifts) return onUpdateDailyShifts([newDailyShift]);
        }}
        onUpdateAttendanceRecord={(attendanceRecord) => {
          if (!selectedDailyShift) return;
          const newDailyShift: DailyShift = { ...selectedDailyShift };
          if (newDailyShift.attendList) {
            newDailyShift.attendList = newDailyShift.attendList.map(
              (attend) => {
                if (
                  attend.date.toLocaleDateString() ===
                    attendanceRecord.date.toLocaleDateString() &&
                  attend.staffId === attendanceRecord.staffId
                )
                  return attendanceRecord;
                return attend;
              },
            );
          }
          console.log("newDailyShift", newDailyShift);
          if (onUpdateDailyShifts) return onUpdateDailyShifts([newDailyShift]);
        }}
      />
    </div>
  );
};

const AttendanceHeaderRow = ({
  range,
  displayType = "Week",
  handleOpenShiftDialog,
  canCreateAttendance = false,
}: {
  range: { startDate: Date; endDate: Date };
  displayType?: DisplayType;
  handleOpenShiftDialog?: (values: Shift | null) => void;
  canCreateAttendance?: boolean;
}) => {
  const rangeDate: Date[] = createRangeDate(range);
  return (
    <div className={cn("flex w-full flex-row items-center")}>
      <ShiftCell
        className={cn(HeaderCellStyle)}
        canCreateAttendance={canCreateAttendance}
        handleOpenShiftDialog={handleOpenShiftDialog}
      />
      {rangeDate.map((date, index) => {
        return (
          <DateCell
            key={index}
            date={date}
            displayType={displayType}
            className={cn(HeaderCellStyle)}
          />
        );
      })}
    </div>
  );
};

const formatDailyShiftList = (
  shift: Shift,
  rangeDate: { startDate: Date; endDate: Date },
) => {
  const range: Date[] = createRangeDate(rangeDate);

  const formattedDailyShiftList: Array<DailyShift> = [];
  range.forEach((date) => {
    const dailyShift = shift.dailyShiftList.find(
      (dailyShift) =>
        dailyShift.date.toLocaleDateString() === date.toLocaleDateString(),
    );
    if (dailyShift === undefined)
      formattedDailyShiftList.push({
        id: -1,
        shiftId: shift.id,
        shiftName: shift.name,
        date: date,
        note: "",
        attendList: [],
      });
    else formattedDailyShiftList.push(dailyShift);
  });
  return formattedDailyShiftList;
};

const IsInWorkingTime = (shift: Shift) => {
  const workingTime = shift.workingTime;
  const currentTime = new Date();
  if (currentTime.getHours() < workingTime.start.getHours()) return false;
  if (currentTime.getHours() > workingTime.end.getHours()) return false;
  if (
    currentTime.getHours() === workingTime.start.getHours() &&
    currentTime.getMinutes() < workingTime.start.getMinutes()
  )
    return false;
  if (
    currentTime.getHours() === workingTime.end.getHours() &&
    currentTime.getMinutes() > workingTime.end.getMinutes()
  )
    return false;
  return true;
};

const AttendanceDataRow = ({
  shift,
  rangeDate,
  displayType = "Week",
  canUpdateAttendance = false,
  canDeleteAttendance = false,
  handleOpenShiftDialog,
  handleOpenSetTimeDialog,
  handleOpenTimeKeepingDialog,
}: {
  shift: Shift;
  rangeDate: { startDate: Date; endDate: Date };
  displayType?: DisplayType;
  canUpdateAttendance?: boolean;
  canDeleteAttendance?: boolean;
  handleOpenShiftDialog?: (value: Shift | null) => void;
  handleOpenSetTimeDialog?: (value: DailyShift | null) => void;
  handleOpenTimeKeepingDialog?: (
    value: AttendanceRecord,
    dailyShift: DailyShift,
  ) => void;
}) => {
  const formattedDailyShiftList = formatDailyShiftList(shift, rangeDate);
  console.log("formattedDailyShiftList", formattedDailyShiftList);
  const isInWorkingTime = IsInWorkingTime(shift);
  return (
    <div className={cn("flex w-full flex-row items-center")}>
      <ShiftInfoCell
        shift={shift}
        className={cn(CellStyle)}
        isInWorkingTime={isInWorkingTime}
        handleOpenShiftDialog={handleOpenShiftDialog}
        canUpdateAttendance={canUpdateAttendance}
      />
      {formattedDailyShiftList.map((dailyShift, index) => {
        return (
          <DataCell
            key={index}
            data={dailyShift}
            handleOpenSetTimeDialog={handleOpenSetTimeDialog}
            handleOpenTimeKeepingDialog={handleOpenTimeKeepingDialog}
            className={cn(CellStyle)}
            canUpdateAttendance={canUpdateAttendance}
          />
        );
      })}
    </div>
  );
};

const ShiftCell = ({
  className,
  handleOpenShiftDialog,
  canCreateAttendance = false,
}: {
  className?: string;
  handleOpenShiftDialog?: (values: Shift | null) => void;
  canCreateAttendance?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex select-none flex-row items-center justify-between px-2",
        className,
      )}
    >
      <span className="font-semibold">Shift</span>
      <PlusCircle
        size={16}
        className={cn(
          "cursor-pointer select-none opacity-50 duration-100 ease-linear hover:opacity-100",
          canCreateAttendance ? "" : "hidden",
        )}
        onClick={() => {
          if (handleOpenShiftDialog) handleOpenShiftDialog(null);
        }}
      />
    </div>
  );
};

const day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DateCell = ({
  date,
  className,
  displayType = "Week",
}: {
  date: Date;
  className?: string;
  displayType?: DisplayType;
}) => {
  return (
    <div
      className={cn(
        "flex select-none flex-row items-center justify-start gap-1 p-2",
        className,
      )}
    >
      <span className={cn("font-semibold")}>{day[date.getDay()]}</span>
      <span
        className={cn(
          "rounded-md px-1 py-1 text-xs",
          date.toLocaleDateString() === new Date().toLocaleDateString()
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-black",
        )}
      >
        {format(date, "dd/MM")}
      </span>
    </div>
  );
};

const ShiftInfoCell = ({
  shift,
  className,
  isInWorkingTime,
  handleOpenShiftDialog,
  canUpdateAttendance = false,
}: {
  shift: Shift;
  className?: string;
  isInWorkingTime?: boolean;
  handleOpenShiftDialog?: (values: Shift | null) => void;
  canUpdateAttendance?: boolean;
}) => {
  let bgcolor = "";
  let pencilColor = "bg-gray-100";
  if (shift.status === Status.NotWorking) {
    bgcolor = "bg-red-500 text-white";
    pencilColor = "bg-red-400";
  } else if (isInWorkingTime) {
    bgcolor = "bg-blue-500 text-white";
    pencilColor = "bg-blue-400";
  }
  return (
    <div
      className={cn("relative flex flex-col p-2", className, bgcolor)}
      onClick={() => {
        if (handleOpenShiftDialog && canUpdateAttendance)
          handleOpenShiftDialog(shift);
      }}
    >
      <span className="font-semibold">{shift.name}</span>
      <span className="text-xs">{`${format(
        shift.workingTime.start,
        "hh:mm a",
      )} - ${format(shift.workingTime.end, "hh:mm a")}`}</span>

      <div
        className={cn(
          "absolute left-0 top-0 h-full w-full cursor-pointer select-none opacity-0 duration-100 ease-linear hover:opacity-100",
          canUpdateAttendance ? "" : "hidden",
        )}
      >
        <div
          className={cn(
            "absolute right-2 top-2 flex justify-center rounded-full  p-1",
            pencilColor,
          )}
        >
          <Pencil size={16} />
        </div>
      </div>
    </div>
  );
};

const DataCell = ({
  data,
  className,
  maxItem = 2,
  handleOpenSetTimeDialog,
  handleOpenTimeKeepingDialog,
  canUpdateAttendance = false,
}: {
  data: DailyShift;
  className?: string;
  maxItem?: number;
  canUpdateAttendance?: boolean;
  handleOpenSetTimeDialog?: (value: DailyShift | null) => void;
  handleOpenTimeKeepingDialog?: (
    value: AttendanceRecord,
    dailyShift: DailyShift,
  ) => void;
}) => {
  const toShow = data.attendList.slice(0, maxItem);
  const hidedItem = data.attendList.length - maxItem;
  const [open, setOpen] = useState(false);
  const dataCellRef = useRef<HTMLDivElement>(null);
  const [anchorPosition, setAnchorPosition] = useState<"top" | "bottom">("top");

  return (
    <div
      className={cn(
        "relative h-full",
        className,
        data.attendList.length == 0
          ? "cursor-pointer duration-200 ease-linear hover:bg-gray-100"
          : "",
      )}
      ref={dataCellRef}
    >
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-start gap-2 py-2",
          open ? "hidden" : "visible",
        )}
      >
        {toShow.map((attend, index) => {
          return (
            <StaffAttendCell
              key={index}
              data={attend}
              dailyShift={data}
              className="w-11/12"
              handleOpenTimeKeepingDialog={handleOpenTimeKeepingDialog}
            />
          );
        })}
        <span
          className={cn(
            "ml-2 self-start rounded-md bg-purple px-2 py-1 text-xs",
            hidedItem > 0 ? "visible" : "hidden",
          )}
        >
          <span className="text-white">+{hidedItem}</span>
        </span>
      </div>

      <div
        className={cn(
          "absolute bottom-0 flex w-full cursor-pointer select-none flex-col items-center justify-center opacity-0 duration-100 ease-linear hover:opacity-100",
          data.attendList.length === 0 || data.attendList.length > maxItem
            ? "h-full"
            : "",
          data.attendList.length === 1 ? "absolute bottom-0 h-1/3" : "",
          data.attendList.length === 2 ? "absolute bottom-0 h-1/4" : "",
        )}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverAnchor asChild>
            <div
              className={cn(
                "absolute h-5 w-full ",
                anchorPosition === "top" ? "top-0" : "bottom-0",
              )}
            ></div>
          </PopoverAnchor>
          <div
            className={cn(
              "flex w-full cursor-pointer select-none flex-row items-center justify-center bg-gray-100 text-gray-600 backdrop-blur-sm duration-100 ease-linear hover:bg-green-400 hover:font-semibold hover:text-white",
              data.attendList.length > maxItem ? "h-1/2" : "h-full",
              canUpdateAttendance ? "" : "hidden",
            )}
            onClick={() => {
              if (handleOpenSetTimeDialog) handleOpenSetTimeDialog(data);
            }}
          >
            Set time
          </div>
          <PopoverTrigger asChild>
            <div
              className={cn(
                "flex h-1/2 w-full cursor-pointer select-none flex-row items-center justify-center bg-gray-100 text-gray-600 backdrop-blur-sm duration-100 ease-linear hover:bg-blue-400 hover:font-semibold hover:text-white",
                data.attendList.length > maxItem ? "visible" : "hidden",
              )}
              onClick={() => {
                const dataCell = dataCellRef.current;

                if (dataCell) {
                  const rect = dataCell.getBoundingClientRect();
                  const isNearBottom = window.innerHeight - rect.bottom < 200;

                  if (isNearBottom) {
                    setAnchorPosition("bottom");
                  } else {
                    setAnchorPosition("top");
                  }
                }
              }}
            >
              Expand
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-40 p-2"
            side={anchorPosition === "top" ? "bottom" : "top"}
          >
            <div className="flex flex-col items-center gap-2">
              {data.attendList.map((attend, index) => {
                return (
                  <StaffAttendCell
                    key={index}
                    data={attend}
                    dailyShift={data}
                    className="w-full"
                    handleOpenTimeKeepingDialog={handleOpenTimeKeepingDialog}
                  />
                );
              })}
              <div
                className="cursor-pointer text-sm hover:font-medium hover:underline"
                onClick={() => setOpen(false)}
              >
                Collapse
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

const StaffAttendCell = ({
  data,
  className,
  dailyShift,
  handleOpenTimeKeepingDialog,
}: {
  data: AttendanceRecord;
  dailyShift?: DailyShift;
  className?: string;
  handleOpenTimeKeepingDialog?: (
    value: AttendanceRecord,
    dailyShift: DailyShift,
  ) => void;
}) => {
  return (
    <div
      className={cn(
        "flex cursor-pointer select-none flex-col rounded-md p-2 duration-200 ease-linear",
        data.hasAttend
          ? "bg-blue-100 hover:bg-blue-200"
          : "bg-orange-100 hover:bg-orange-200",
        className,
      )}
      onClick={() => {
        if (handleOpenTimeKeepingDialog && dailyShift)
          handleOpenTimeKeepingDialog(data, dailyShift);
      }}
    >
      <span>{data.staffName}</span>
    </div>
  );
};

const Table = dynamic(() => Promise.resolve(AttendanceTable), {
  ssr: false,
});

export { Table };
