import { Role } from "@/entities/RoleSetting";
import { convertRoleReceived } from "@/utils/roleSettingApiUtils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const roleSlice = createSlice({
  name: "role",
  initialState: {
    value: [] as Role[],
  },
  reducers: {
    setRoles: (state, action: PayloadAction<any[]>) => {
      const roles = action.payload.map((role) => convertRoleReceived(role));
      state.value = roles;
    },
    addRole: (state, action: PayloadAction<any>) => {
      const role = convertRoleReceived(action.payload);
      state.value.push(role);
    },
    updateRole: (state, action: PayloadAction<any>) => {
      const updatedRole = convertRoleReceived(action.payload);
      state.value = state.value.map((role) =>
        role.positionId === updatedRole.positionId ? updatedRole : role,
      );
    },
    deleteRole: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter(
        (role) => role.positionId !== action.payload,
      );
    },
  },
});

export const { setRoles, addRole, updateRole, deleteRole } = roleSlice.actions;
export default roleSlice.reducer;
