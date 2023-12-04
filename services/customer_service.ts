import { Customer, CustomerGroup } from "@/entities/Customer";
import AxiosService from "./axios_service";

const uploadCustomer = (data: any) => {
  return AxiosService.post<Customer>("/api/customers", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const uploadCustomerGroup = (groupName: string) => {
  return AxiosService.post<CustomerGroup>("/api/customer-groups", {
    name: groupName,
    // description: null,
  });
};

const getAllCustomerGroups = () => {
  return AxiosService.get<CustomerGroup[]>("/api/customer-groups");
};

const getAllCustomers = () => {
  return AxiosService.get<Customer[]>("/api/customers");
};

const CustomerService = {
  uploadCustomer,
  getAllCustomers,
  uploadCustomerGroup,
  getAllCustomerGroups,
};

export default CustomerService;
