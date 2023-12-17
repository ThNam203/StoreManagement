import { Position, Staff } from "@/entities/Staff";
import AxiosService from "./axios_service";

const getAllStaffs = () => {
  return AxiosService.get<Staff[]>("/api/staffs");
};

const createNewStaff = (data: any) => {
  return AxiosService.post<Staff>("/api/staffs", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
const updateStaff = (id: any, data: any) => {
  return AxiosService.put<Staff>("/api/staffs/" + id, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
const deleteStaff = (id: any) => {
  return AxiosService.delete("/api/staffs/" + id);
};
const calculateSalary = (id: any) => {
  return AxiosService.get<{ salaryDebt: number }>(
    "/api/staffs/" + id + "/calculate-salary",
  );
};
const getAllPositions = () => {
  return AxiosService.get<Position[]>("/api/staff-positions");
};
const createNewPosition = (data: any) => {
  return AxiosService.post<Position>("/api/staff-positions", data);
};
const updatePosition = (id: any, data: any) => {
  return AxiosService.put<Position>("/api/staff-positions" + id, data);
};
const deletePosition = (id: any) => {
  return AxiosService.delete("/api/staff-positions" + id);
};
const StaffService = {
  getAllStaffs,
  createNewStaff,
  updateStaff,
  deleteStaff,
  calculateSalary,
  getAllPositions,
  createNewPosition,
  updatePosition,
  deletePosition,
};

export default StaffService;
