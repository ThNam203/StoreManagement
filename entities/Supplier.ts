export type Supplier = {
  id: any;
  name: string;
  phoneNumber: string;
  supplierGroup: string;
  email: string;
  address: string;
  company: string;
  note: string;
  taxId: string;
  creator: string;
  createdDate: Date;
  debt: number;
  sale: number;
  totalSale: number;
  status: Status;
};

export enum Status {
  WORKING = "Working",
  NOT_WORKING = "Not Working",
}
