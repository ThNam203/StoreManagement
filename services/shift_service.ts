import AxiosService from "./axios_service";
import { Shift } from "@/app/(main)/(routes)/staff/attendance/attendance_table";

const getAllShifts = () => {
  return AxiosService.get<Shift[]>("/api/shifts");
};

const updateShift = (id: any, data: any) => {
  return AxiosService.put<Shift>("/api/shifts/" + id, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
const deleteShift = (id: any) => {
  return AxiosService.delete("/api/shifts/" + id);
};

const ShiftService = {
  getAllShifts,
  updateShift,
  deleteShift,
};

export default ShiftService;
