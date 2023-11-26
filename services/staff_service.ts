import { Staff } from "@/entities/Staff";
import AxiosService from "./axios_service";

const getAllStaffs = () => {
  return AxiosService.get<Staff[]>("/api/staffs");
};
const createNewStaff = (data: any) => {
  console.log("data to sent", data);
  return AxiosService.post<Staff>("/api/staffs", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
const StaffService = {
  getAllStaffs,
  createNewStaff,
};

export default StaffService;
