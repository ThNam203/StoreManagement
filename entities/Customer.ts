export type Customer = {
  id: any;
  name: string;
  customerGroup: string;
  phoneNumber: string;
  address: string;
  sex: "Male" | "Female" | "Not to say";
  email: string;
  birthday: string;
  creator: string;
  createdDate: Date;
  description: string;
  image: {
    id: number,
    url: string,
  } | null;
};

export type CustomerGroup = {
  id: number;
  name: string;
  createdDate: string;
};
