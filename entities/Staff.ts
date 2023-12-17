import { SalarySetting } from "./SalarySetting";

export type Staff = {
  avatar: string;
  id: any;
  name: string;
  phoneNumber: string;
  cccd: string;
  salaryDebt: number;
  note: string;
  birthday: Date;
  sex: Sex;
  email: string;
  address: string;
  position: string;
  createAt: Date;
  role: string;
  salarySetting: SalarySetting;
  password: string;
};

export enum Sex {
  MALE = "Male",
  FEMALE = "Female",
}

export type Paycheck = {
  id: any;
  workingPeriod: {
    startDate: Date;
    endDate: Date;
  };
  totalSalary: number;
  paid: number;
  needToPay: number;
};

export type WorkSchedule = {
  date: Date;
  shiftName: string;
  startTime: Date;
  endTime: Date;
  note: string;
};

export type Position = {
  id: any;
  name: string;
};
