import { DailyShift, Shift, ViolationAndReward } from "@/entities/Attendance";
import AxiosService from "./axios_service";

const getShiftsByRange = (range: { startDate: Date; endDate: Date }) => {
  return AxiosService.get<Shift[]>(
    "/api/shifts/" +
      range.startDate.toISOString() +
      "/" +
      range.endDate.toISOString(),
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
const updateDailyShifts = (data: any) => {
  console.log("data to be", data);
  return AxiosService.post<DailyShift[]>("/api/daily-shifts/update", data);
};
const deleteDailyShift = (id: any) => {
  return AxiosService.delete("/api/shifts/" + id);
};

const getViolationAndRewardList = () => {
  return AxiosService.get<ViolationAndReward[]>("/api/violation-and-rewards");
};

const createViolationAndReward = (data: any) => {
  return AxiosService.post<ViolationAndReward>(
    "/api/violation-and-rewards",
    data,
  );
};

const updateViolationAndReward = (id: any, data: any) => {
  return AxiosService.put<ViolationAndReward>(
    "/api/violation-and-rewards/" + id,
    data,
  );
};

const deleteViolationAndReward = (id: any) => {
  return AxiosService.delete("/api/violation-and-rewards/" + id);
};

const ShiftService = {
  getShiftsByRange,
  getShiftsThisMonth,
  createShift,
  updateShift,
  deleteShift,
  createDailyShifts,
  updateDailyShifts,
  deleteDailyShift,
  getViolationAndRewardList,
  createViolationAndReward,
  updateViolationAndReward,
  deleteViolationAndReward,
};

export default ShiftService;
