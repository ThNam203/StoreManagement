import { DailyShift, Shift } from "@/entities/Attendance";
import AxiosService from "./axios_service";

const getShiftsByRange = (range: { startDate: Date; endDate: Date }) => {
  return AxiosService.get<Shift[]>(
    "/api/shifts/" +
      range.startDate.toISOString() +
      "/" +
      range.endDate.toISOString()
  );
};
const getShiftsThisMonth = () => {
  return AxiosService.get<Shift[]>("/api/shifts/month");
};
const createShift = (data: any) => {
  return AxiosService.post<Shift>("/api/shifts", data);
};
const updateShift = (id: any, data: any) => {
  return AxiosService.put<Shift>("/api/shifts/" + id, data);
};
const deleteShift = (id: any) => {
  return AxiosService.delete("/api/shifts/" + id);
};
const createDailyShifts = (data: any) => {
  console.log("data", data);
  return AxiosService.post<DailyShift[]>("/api/daily-shifts", data);
};
const updateDailyShift = (id: any, data: any) => {
  return AxiosService.put<DailyShift>("/api/daily-shifts/" + id, data);
};
const deleteDailyShift = (id: any) => {
  return AxiosService.delete("/api/shifts/" + id);
};

const ShiftService = {
  getShiftsByRange,
  getShiftsThisMonth,
  createShift,
  updateShift,
  deleteShift,
  createDailyShifts,
  updateDailyShift,
  deleteDailyShift,
};

export default ShiftService;
