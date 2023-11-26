import { Staff } from "@/entities/Staff";
import AxiosService from "./axios_service";

const getAllStaffs = () => {
  return AxiosService.get<Staff[]>("/api/staffs");
};
const createNewStaff = (value: Staff) => {
  return AxiosService.post<Staff>("/api/staffs");
};

const StaffService = {
  getAllStaffs,
  createNewStaff,
};

export default StaffService;
