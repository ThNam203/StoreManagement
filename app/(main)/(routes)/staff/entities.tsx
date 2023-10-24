export type Staff = {
  id: any;
  name: string;
  staffGroup?: any;
  position: string;
  branch: string;
  phoneNumber: string;
  CCCD: string;
  address: string;
  sex: string;
  email: string;
  birthday: string;
};

export type StaffGroup = {
  id: any;
  groupName: string;
  note: string;
};