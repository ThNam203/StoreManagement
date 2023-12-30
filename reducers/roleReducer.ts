import { Role } from "@/entities/RoleSetting";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const roleSlice = createSlice({
  name: "role",
  initialState: {
    value: [] as Role[],
  },
  reducers: {
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.value = action.payload;
    },
    addRole: (state, action: PayloadAction<Role>) => {
      state.value.push(action.payload);
    },
    updateRole: (state, action: PayloadAction<Role>) => {
      state.value = state.value.map((role) =>
        role.positionId === action.payload.positionId ? action.payload : role,
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
