import AxiosService from "./axios_service";

export const getAllStaffs = () => {
  return AxiosService.get<string[]>("/api/staffs");
};
