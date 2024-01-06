import { Staff } from "@/entities/Staff";
import { convertStaffReceived } from "@/utils/staffApiUtils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const staffSlice = createSlice({
  name: "staffs",
  initialState: {
    value: [] as Staff[],
  },
  reducers: {
    setStaffs: (state, action: PayloadAction<any[]>) => {
      const staffs = action.payload.map((staff) => convertStaffReceived(staff));
      state.value = staffs;
    },
    addStaff: (state, action: PayloadAction<any>) => {
      const staff = convertStaffReceived(action.payload);
      state.value.push(staff);
    },
    addStaffs: (state, action: PayloadAction<any[]>) => {
      const staffs = action.payload.map((staff) => convertStaffReceived(staff));
      staffs.forEach((staff) => state.value.push(staff));
    },
    updateStaff: (state, action: PayloadAction<any>) => {
      const updatedStaff = convertStaffReceived(action.payload);
      state.value = state.value.map((staff) =>
        staff.id === updatedStaff.id ? updatedStaff : staff,
      );
    },

    deleteStaff: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((staff) => staff.id !== action.payload);
    },
  },
});

export const { setStaffs, addStaff, addStaffs, deleteStaff, updateStaff } =
  staffSlice.actions;
export default staffSlice.reducer;
