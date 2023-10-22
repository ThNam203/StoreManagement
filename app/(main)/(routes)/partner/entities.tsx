export type Customer = {
  id: any;
  name: string;
  customerGroup: any;
  phoneNumber: string;
  address: string;
  sex: string;
  email: string;
  birthday: string;
  image: string;
  creator: string;
  createdDate: string;
  note: string;
  //id, name, phone_number, date_of_birth, address, sex, email, customer_group, image, description, creator, created_date, status (working or not working)
};

export type CustomerGroup = {
  //customer_group: id, name, description, constraints, creator, created_date
  id: any;
  name: string;
  description: string;
};

export type Supplier = {
  id: any;
  name: string;
  phoneNumber: string;
  address: string;
  email: string;
  supplierGroup: any;
  image: string;
  description: string;
  companyName: string;
  creator: any;
  createdDate: string;
  status: string;
  note: string;
  //supplier: id, name, phone_number, address, email, supplier_group, image, description, company_name, creator, created_date, status (working or not working)
};
