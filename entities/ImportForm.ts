export type ImportForm = {
  id: any;
  returnId?: any;
  createdDate: Date;
  updatedDate: Date;
  supplier: string;
  branch: string;
  creator: string;
  quantity: number;
  itemQuantity: number;
  subTotal: number;
  discountType: string;
  discount: number;
  total: number;
  moneyGiven: number;
  change: number;
  note: string;
  status: Status;
};

export enum Status {
  IMPORTED = "Imported",
  UNIMPORTED = "Unimported",
}
