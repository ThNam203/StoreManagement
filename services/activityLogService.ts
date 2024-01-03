import { ActivityLog } from "@/entities/ActivityLog";
import AxiosService from "./axiosService";

const getAllActivityLogs = () => {
  return AxiosService.get<ActivityLog[]>("/api/activity-logs");
};

const ActivityLogService = {
  getAllActivityLogs,
};

export default ActivityLogService;
