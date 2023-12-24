export enum Status {
  Working = "Working",
  NotWorking = "Not working",
}

export type Shift = {
  id: any;
  name: string;
  workingTime: { start: Date; end: Date };
  editingTime: { start: Date; end: Date };
  dailyShiftList: DailyShift[];
  status: Status;
};

export type DailyShift = {
  id: any;
  date: Date;
  shiftId: any;
  shiftName: string;
  note: string;
  attendList: AttendanceRecord[];
};

export type AttendanceRecord = {
  id: any;
  staffId: any;
  staffName: string;
  hasAttend: boolean;
  date: Date;
  note: string;
  bonus: BonusAndPunish[];
  punish: BonusAndPunish[];
};
export type BonusAndPunish = {
  name: string;
  value: number;
  times: number;
};

export type ViolationAndReward = {
  id: any;
  name: string;
  defaultValue: number;
  type: string; // "Bonus" or "Punish"
};
