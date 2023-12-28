export enum SupplierStatuses {
  Active = "Active",
  Disabled = "Disabled",
}

export type Supplier = {
  id: number;
  name: string,
  address: string,
  phoneNumber: string,
  email: string,
  description: string,
  companyName: string,
  status: "Active" | "Disabled",
  supplierGroupName: string,
};

export type SupplierGroup = {
  id: number,
  name: string,
  description: string,
  address: string,
  company: string
}
