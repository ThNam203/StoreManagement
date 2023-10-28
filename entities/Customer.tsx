export type Customer = {
  id: any;
  name: string;
  customerType: CustomerType;
  customerGroup: string;
  phoneNumber: string;
  address: string;
  sex: string;
  email: string;
  birthday: string;
  creator: string;
  createdDate: string;
  company: string;
  taxId: string;
  note: string;
  lastTransaction: string;
  debt: number;
  sale: number;
  finalSale: number;
  status: Status;
};

export type CustomerGroup = {
  id: any;
  name: string;
  createdDate: string;
};

export enum CustomerType {
  SINGLE = "Single",
  COMPANY = "Company",
}
export enum Status {
  WORKING = "Working",
  NOT_WORKING = "Not Working",
}
