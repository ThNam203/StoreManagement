import { Shift } from "@/app/(main)/(routes)/staff/attendance/attendance_table";
import { Staff } from "@/entities/Staff";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const shiftSlice = createSlice({
  name: "shifts",
  initialState: {
    value: [] as Shift[],
  },
  reducers: {
    setShifts: (state, action: PayloadAction<Shift[]>) => {
      state.value = action.payload;
    },
    addShift: (state, action: PayloadAction<Shift>) => {
      state.value.push(action.payload);
    },
    addShifts: (state, action: PayloadAction<Shift[]>) => {
      action.payload.forEach((staff) => state.value.push(staff));
    },
    updateShift: (state, action: PayloadAction<Shift>) => {
      state.value = state.value.map((staff) =>
        staff.id === action.payload.id ? action.payload : staff
      );
    },

    deleteShift: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((staff) => staff.id !== action.payload);
    },
  },
});

export const { setShifts, addShift, addShifts, updateShift, deleteShift } =
  shiftSlice.actions;
export default shiftSlice.reducer;
