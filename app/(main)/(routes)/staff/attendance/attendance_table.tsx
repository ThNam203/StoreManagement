"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Staff } from "@/entities/Staff";
import { cn } from "@/lib/utils";
import { format, set } from "date-fns";
import { Pencil, PlusCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AddShiftDialog } from "./add_shift_dialog";
import { SetTimeDialog } from "./set_time_dialog";
import Image from "next/image";
import { AttendanceRecord, DailyShift, Shift } from "@/entities/Attendance";
import { TimeKeepingDialog } from "./timekeeping_dialog";
import { on } from "events";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { is } from "date-fns/locale";
const borderStyle = "border border-gray-100 border-[1px]";
const HeaderCellStyleWeek = "w-[calc(100%/8)] h-10" + " " + borderStyle;
const CellStyleWeek = "w-[calc(100%/8)] h-44" + " " + borderStyle;
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
  onUpdateDailyShift,
}: {
  shiftList: Shift[];
  rangeDate: { startDate: Date; endDate: Date };
  displayType?: DisplayType;
  staffList: Staff[];
  onUpdateShift?: (values: Shift) => any;
  onRemoveShift?: (id: any) => any;
  onSetTime?: (values: DailyShift[]) => any;
  onUpdateDailyShift?: (values: DailyShift) => any;
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
    dailyShift: DailyShift
  ) => {
    setSelectedAttendance(attendance);
    setSelectedDailyShift(dailyShift);
    setOpenTimeKeepingDialog(true);
  };

  useEffect(() => {
    const sortedData = [...shiftList];
    sortedData.sort(
      (a, b) => a.workingTime.start.getTime() - b.workingTime.start.getTime()
    );
    setData(sortedData);
    console.log("table", sortedData);
  }, [shiftList]);

  return (
    <ScrollArea className={cn("w-full rounded-md shadow pb-2")}>
      <table className="w-full bg-white overflow-x-scroll">
        <tr>
          <AttendanceHeaderRow
            range={rangeDate}
            displayType={displayType}
            handleOpenShiftDialog={handleOpenAddShiftDialog}
          />
        </tr>
        {data.length === 0 && (
          <tr>
            <Image
              alt="No shift found"
              width={300}
              height={200}
              src={"/no-shift-found.png"}
              className="object-contain mx-auto"
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
        handleRemoveShift={onRemoveShift}
      />
      <SetTimeDialog
        open={openSetTimeDialog}
        setOpen={setOpenSetTimeDialog}
        shiftList={data}
        staffList={staffList}
        specificShift={selectedDailyShift}
        submit={onSetTime}
        onUpdateDailyShift={onUpdateDailyShift}
      />
      <TimeKeepingDialog
        open={openTimeKeepingDialog}
        setOpen={setOpenTimeKeepingDialog}
        attendanceRecord={selectedAttendance}
        dailyShift={selectedDailyShift}
        onRemoveAttendanceRecord={(attendanceRecord) => {
          if (!selectedDailyShift) return;
          const newDailyShift: DailyShift = { ...selectedDailyShift };
          if (newDailyShift.attendList) {
            newDailyShift.attendList = newDailyShift.attendList.filter(
              (attend) =>
                attend.date.toLocaleDateString() !==
                  attendanceRecord.date.toLocaleDateString() ||
                attend.staffId !== attendanceRecord.staffId
            );
          }
          console.log("newDailyShift", newDailyShift);
          if (onUpdateDailyShift) return onUpdateDailyShift(newDailyShift);
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
              }
            );
          }
          console.log("newDailyShift", newDailyShift);
          if (onUpdateDailyShift) return onUpdateDailyShift(newDailyShift);
        }}
      />
      <ScrollBar orientation="horizontal" className="bg-red-300" />
    </ScrollArea>
  );
};

const createRangeDate = (range: { startDate: Date; endDate: Date }): Date[] => {
  const rangeDate: Date[] = [];
  //create an array of date from startDate to endDate
  for (
    let i = range.startDate.getTime();
    i <= range.endDate.getTime();
    i += 86400000
  ) {
    rangeDate.push(new Date(i));
  }
  return rangeDate;
};

const AttendanceHeaderRow = ({
  range,
  displayType = "Week",
  handleOpenShiftDialog,
}: {
  range: { startDate: Date; endDate: Date };
  displayType?: DisplayType;
  handleOpenShiftDialog?: (values: Shift | null) => void;
}) => {
  const rangeDate: Date[] = createRangeDate(range);
  return (
    <div className={cn("w-full flex flex-row items-center")}>
      <ShiftCell
        className={cn(HeaderCellStyle)}
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
  rangeDate: { startDate: Date; endDate: Date }
) => {
  const range: Date[] = createRangeDate(rangeDate);

  const formattedDailyShiftList: Array<DailyShift> = [];
  range.forEach((date) => {
    const dailyShift = shift.dailyShiftList.find(
      (dailyShift) =>
        dailyShift.date.toLocaleDateString() === date.toLocaleDateString()
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
  handleOpenShiftDialog,
  handleOpenSetTimeDialog,
  handleOpenTimeKeepingDialog,
}: {
  shift: Shift;
  rangeDate: { startDate: Date; endDate: Date };
  displayType?: DisplayType;
  handleOpenShiftDialog?: (value: Shift | null) => void;
  handleOpenSetTimeDialog?: (value: DailyShift | null) => void;
  handleOpenTimeKeepingDialog?: (
    value: AttendanceRecord,
    dailyShift: DailyShift
  ) => void;
}) => {
  const formattedDailyShiftList = formatDailyShiftList(shift, rangeDate);
  console.log("formattedDailyShiftList", formattedDailyShiftList);
  const isInWorkingTime = IsInWorkingTime(shift);
  return (
    <div className={cn("w-full flex flex-row items-center")}>
      <ShiftInfoCell
        shift={shift}
        className={cn(CellStyle)}
        isInWorkingTime={isInWorkingTime}
        handleOpenShiftDialog={handleOpenShiftDialog}
      />
      {formattedDailyShiftList.map((dailyShift, index) => {
        return (
          <DataCell
            key={index}
            data={dailyShift}
            handleOpenSetTimeDialog={handleOpenSetTimeDialog}
            handleOpenTimeKeepingDialog={handleOpenTimeKeepingDialog}
            className={cn(CellStyle)}
          />
        );
      })}
    </div>
  );
};

const ShiftCell = ({
  className,
  handleOpenShiftDialog,
}: {
  className?: string;
  handleOpenShiftDialog?: (values: Shift | null) => void;
}) => {
  return (
    <div
      className={cn(
        "px-2 flex flex-row items-center justify-between select-none",
        className
      )}
    >
      <span className="font-semibold">Shift</span>
      <PlusCircle
        size={16}
        className="opacity-50 hover:opacity-100 ease-linear duration-100 cursor-pointer select-none"
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
        "p-2 flex flex-row items-center justify-start gap-1 select-none",
        className
      )}
    >
      <span className={cn("font-semibold")}>{day[date.getDay()]}</span>
      <span
        className={cn(
          "rounded-md px-1 py-1 text-xs",
          date.toLocaleDateString() === new Date().toLocaleDateString()
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-black"
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
}: {
  shift: Shift;
  className?: string;
  isInWorkingTime?: boolean;
  handleOpenShiftDialog?: (values: Shift | null) => void;
}) => {
  return (
    <div
      className={cn(
        "p-2 flex flex-col relative",
        className,
        isInWorkingTime ? "bg-blue-500 text-white" : ""
      )}
      onClick={() => {
        if (handleOpenShiftDialog) handleOpenShiftDialog(shift);
      }}
    >
      <span className="font-semibold">{shift.name}</span>
      <span className="text-xs">{`${format(
        shift.workingTime.start,
        "hh:mm a"
      )} - ${format(shift.workingTime.end, "hh:mm a")}`}</span>

      <div className="w-full h-full absolute top-0 left-0 cursor-pointer select-none opacity-0 hover:opacity-100 ease-linear duration-100">
        <div
          className={cn(
            "flex justify-center p-1 absolute top-2 right-2  rounded-full",
            isInWorkingTime ? "bg-blue-400" : "bg-gray-100"
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
}: {
  data: DailyShift;
  className?: string;
  maxItem?: number;
  handleOpenSetTimeDialog?: (value: DailyShift | null) => void;
  handleOpenTimeKeepingDialog?: (
    value: AttendanceRecord,
    dailyShift: DailyShift
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
        "h-full relative",
        className,
        data.attendList.length == 0
          ? "hover:bg-gray-100 ease-linear duration-200 cursor-pointer"
          : ""
      )}
      ref={dataCellRef}
    >
      <div
        className={cn(
          "w-full h-full flex flex-col items-center justify-start gap-2 py-2",
          open ? "hidden" : "visible"
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
            "self-start bg-pink-200 rounded-md py-1 px-2 text-xs ml-2",
            hidedItem > 0 ? "visible" : "hidden"
          )}
        >
          +{hidedItem}
        </span>
      </div>

      <div
        className={cn(
          "w-full opacity-0 flex flex-col items-center justify-center absolute bottom-0 hover:opacity-100 ease-linear duration-100 cursor-pointer select-none",
          data.attendList.length === 0 || data.attendList.length > maxItem
            ? "h-full"
            : "",
          data.attendList.length === 1 ? "h-1/3 absolute bottom-0" : "",
          data.attendList.length === 2 ? "h-1/4 absolute bottom-0" : ""
        )}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverAnchor asChild>
            <div
              className={cn(
                "w-full h-5 bg-red-100 absolute",
                anchorPosition === "top" ? "top-0" : "bottom-0"
              )}
            ></div>
          </PopoverAnchor>
          <div
            className={cn(
              "w-full flex flex-row items-center justify-center bg-gray-100 hover:bg-green-400 hover:text-white hover:font-semibold backdrop-blur-sm text-gray-600 ease-linear duration-100 cursor-pointer select-none",
              data.attendList.length > maxItem ? "h-1/2" : "h-full"
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
                "w-full h-1/2 flex flex-row items-center justify-center bg-gray-100 hover:bg-blue-400 hover:text-white hover:font-semibold backdrop-blur-sm text-gray-600 ease-linear duration-100 cursor-pointer select-none",
                data.attendList.length > maxItem ? "visible" : "hidden"
              )}
              onClick={() => {
                const dataCell = dataCellRef.current;

                if (dataCell) {
                  const rect = dataCell.getBoundingClientRect();
                  const isNearBottom = window.innerHeight - rect.bottom < 200;
                  console.log("rect bottom", rect.bottom);
                  console.log("window.innerHeight", window.innerHeight);
                  console.log("isNearBottom", isNearBottom);

                  if (isNearBottom) {
                    setAnchorPosition("bottom");
                  } else {
                    setAnchorPosition("top");
                  }
                  console.log("anchorPosition", anchorPosition);
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
                className="text-sm hover:font-medium cursor-pointer hover:underline"
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
    dailyShift: DailyShift
  ) => void;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col rounded-md p-2 ease-linear duration-200 cursor-pointer select-none",
        data.hasAttend
          ? "bg-blue-100 hover:bg-blue-200"
          : "bg-orange-100 hover:bg-orange-200",
        className
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
