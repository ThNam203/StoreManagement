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

const updateCustomer = (customerData: FormData, customerId: number) => {
  return AxiosService.put<Customer>(`/api/customers/${customerId}`, customerData);
};

const getAllCustomerGroups = () => {
  return AxiosService.get<CustomerGroup[]>("/api/customer-groups");
};

const getAllCustomers = () => {
  return AxiosService.get<Customer[]>("/api/customers");
};

const deleteCustomer = (customerId: number) => {
  return AxiosService.delete<Customer>(`/api/customers/${customerId}`);
};

const CustomerService = {
  uploadCustomer,
  getAllCustomers,
  uploadCustomerGroup,
  getAllCustomerGroups,
  deleteCustomer,
  updateCustomer
};

export default CustomerService;
