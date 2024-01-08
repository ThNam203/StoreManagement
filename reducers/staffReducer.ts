import { Staff } from "@/entities/Staff";
import { convertStaffReceived } from "@/utils/staffApiUtils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const updateActiveStaffs = (staffs: Staff[]) => {
  return staffs.filter((staff) => !staff.isDeleted);
};

export const staffSlice = createSlice({
  name: "staffs",
  initialState: {
    value: [] as Staff[],
    activeStaffs: [] as Staff[],
  },
  reducers: {
    setStaffs: (state, action: PayloadAction<any[]>) => {
      const staffs = action.payload.map((staff) => convertStaffReceived(staff));
      state.value = staffs;
      state.activeStaffs = updateActiveStaffs(state.value);
    },
    addStaff: (state, action: PayloadAction<any>) => {
      const staff = convertStaffReceived(action.payload);
      state.value.push(staff);
      state.activeStaffs = updateActiveStaffs(state.value);
    },
    addStaffs: (state, action: PayloadAction<any[]>) => {
      const converted = action.payload.map((staff) =>
        convertStaffReceived(staff),
      );
      const staffs = updateActiveStaffs(converted);
      staffs.forEach((staff) => {
        state.value.push(staff);
      });
      state.activeStaffs = updateActiveStaffs(state.value);
    },
    updateStaff: (state, action: PayloadAction<any>) => {
      const updatedStaff = convertStaffReceived(action.payload);
      state.value = state.value.map((staff) =>
        staff.id === updatedStaff.id ? updatedStaff : staff,
      );
      state.activeStaffs = updateActiveStaffs(state.value);
    },

    deleteStaff: (state, action: PayloadAction<number>) => {
      state.activeStaffs = state.activeStaffs.filter(
        (staff) => staff.id !== action.payload,
      );
    },
  },
});

export const { setStaffs, addStaff, addStaffs, deleteStaff, updateStaff } =
  staffSlice.actions;
export default staffSlice.reducer;
