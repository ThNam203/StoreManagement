export type Staff = {
  avatar: string;
  id: any;
  name: string;
  phoneNumber: string;
  CCCD: string;
  salaryDebt: number;
  note: string;
  birthday: Date;
  sex: Sex;
  email: string;
  address: string;
  branch: string;
  position: string;
  createAt: Date;
};

export enum Sex {
  MALE = "Male",
  FEMALE = "Female",
}

export type StaffGroup = {
  id: any;
  groupName: string;
  note: string;
};
