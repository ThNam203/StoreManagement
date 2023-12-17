import { AttendanceRecord, DailyShift, Shift } from "@/entities/Attendance";

const convertAttendanceToSent = (value: AttendanceRecord) => {
  let bonusList: any[] = [];
  let punishList: any[] = [];
  if (value.bonus) {
    bonusList = value.bonus.map((bonus) => {
      return {
        value: bonus.value,
        name: bonus.name,
        multiply: bonus.times,
      };
    });
  }
  if (value.punish) {
    punishList = value.punish.map((punish) => {
      return {
        value: punish.value,
        name: punish.name,
        multiply: punish.times,
      };
    });
  }

  const converted: any = {
    staffId: value.staffId,
    hasAttend: value.hasAttend,
    date: value.date.toISOString(),
    note: value.note,
    bonusSalaryList: value.bonus.length > 0 ? bonusList : [],
    punishSalaryList: value.punish.length > 0 ? punishList : [],
  };
  return converted;
};

const convertDailyShiftToSent = (value: DailyShift) => {
  console.log("dailyShift before convert", value);
  console.log("date to ISOS", value.date.toISOString());
  const converted: any = {
    id: value.id,
    shiftId: value.shiftId,
    date: value.date.toISOString(),
    note: value.note,
    attendanceList: [] as any[],
  };
  value.attendList.forEach((attendanceRecord) => {
    converted.attendanceList.push(convertAttendanceToSent(attendanceRecord));
  });
  console.log("sent dailyShift", converted);
  return converted;
};

const convertShiftToSent = (value: Shift) => {
  const converted: any = {
    id: value.id,
    name: value.name,
    status: value.status,
    workingTime: {
      startTime: value.workingTime.start.toISOString(),
      endTime: value.workingTime.end.toISOString(),
    },
    clickingTime: {
      startTime: value.editingTime.start.toISOString(),
      endTime: value.editingTime.end.toISOString(),
    },
  };
  return converted;
};

const convertAttendanceReceived = (value: any): AttendanceRecord => {
  let bonusList = [] as any[];
  let punishList = [] as any[];

  if (value.bonusSalaryList) {
    bonusList = value.bonusSalaryList.map((bonus: any) => {
      return {
        value: bonus.value,
        name: bonus.name,
        times: bonus.multiply,
      };
    });
  }
  if (value.punishSalaryList) {
    punishList = value.punishSalaryList.map((punish: any) => {
      return {
        value: punish.value,
        name: punish.name,
        times: punish.multiply,
      };
    });
  }
  const attendance: AttendanceRecord = {
    id: value.id,
    staffId: value.staffId,
    staffName: value.staffName,
    hasAttend: value.hasAttend,
    date: new Date(value.date),
    note: value.note,
    bonus: bonusList,
    punish: punishList,
  };
  return attendance;
};
const convertDailyShiftReceived = (value: any) => {
  const dailyShift: DailyShift = {
    id: value.id,
    shiftId: value.shiftId,
    shiftName: value.shiftName,
    date: new Date(value.date),
    note: value.note,
    attendList: [],
  };
  if (value.attendanceList) {
    value.attendanceList.forEach((attendance: any) => {
      dailyShift.attendList.push(convertAttendanceReceived(attendance));
    });
  }
  console.log("received dailyShift", dailyShift);
  return dailyShift;
};

const convertShiftReceived = (value: any): Shift => {
  console.log("value", value);
  const shift: Shift = {
    id: value.id,
    name: value.name,
    status: value.status,
    workingTime: {
      start: new Date(value.workingTime.startTime),
      end: new Date(value.workingTime.endTime),
    },
    editingTime: {
      start: new Date(value.clickingTime.startTime),
      end: new Date(value.clickingTime.endTime),
    },
    dailyShiftList: [],
  };
  if (value.dailyShiftList) {
    value.dailyShiftList.forEach((dailyShift: any) => {
      shift.dailyShiftList.push(convertDailyShiftReceived(dailyShift));
    });
  }
  console.log("received shift", shift);
  return shift;
};

export {
  convertAttendanceToSent,
  convertDailyShiftToSent,
  convertShiftToSent,
  convertAttendanceReceived,
  convertDailyShiftReceived,
  convertShiftReceived,
};
