import { Role, RoleSetting } from "@/entities/RoleSetting";
import AxiosService from "./axiosService";

const getAllRoles = () => {
  return AxiosService.get<Role[]>("/api/role-setting");
};
const saveRoleSetting = (id: any, data: any) => {
  return AxiosService.put<RoleSetting>("/api/role-setting/" + id, data);
};
const addNewRole = (data: any) => {
  return AxiosService.post<Role>("/api/role-setting", data);
};

const deleteRole = (id: any) => {
  return AxiosService.delete<Role>("/api/role-setting/" + id);
};

const RoleService = {
  getAllRoles,
  saveRoleSetting,
  addNewRole,
  deleteRole,
};
export default RoleService;
