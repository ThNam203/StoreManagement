import { Staff } from "@/entities/Staff";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const staffSlice = createSlice({
  name: "staffs",
  initialState: {
    value: [] as Staff[],
  },
  reducers: {
    setStaffs: (state, action: PayloadAction<Staff[]>) => {
      state.value = action.payload;
    },
    addStaff: (state, action: PayloadAction<Staff>) => {
      state.value.push(action.payload);
    },
    addStaffs: (state, action: PayloadAction<Staff[]>) => {
      action.payload.forEach((staff) => state.value.push(staff));
    },
    updateStaff: (state, action: PayloadAction<Staff>) => {
      state.value = state.value.map((staff) =>
        staff.id === action.payload.id ? action.payload : staff
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
