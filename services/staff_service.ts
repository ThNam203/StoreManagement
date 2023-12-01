import { Staff } from "@/entities/Staff";
import AxiosService from "./axios_service";

const getAllStaffs = () => {
  return AxiosService.get<Staff[]>("/api/staffs");
};
const createNewStaff = (data: any) => {
  return AxiosService.post<Staff>("/api/staffs", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
const updateStaff = (data: any) => {
  return AxiosService.post<Staff>("/api/staffs/" + data.id, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
const deleteStaff = (id: any) => {
  return AxiosService.delete("/api/staffs/" + id);
};
const StaffService = {
  getAllStaffs,
  createNewStaff,
  updateStaff,
  deleteStaff,
};

export default StaffService;
