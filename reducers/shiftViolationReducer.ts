import { DailyShift, Shift, ViolationAndReward } from "@/entities/Attendance";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const violationSlice = createSlice({
  name: "violations",
  initialState: {
    value: [] as ViolationAndReward[],
  },
  reducers: {
    setViolations: (state, action: PayloadAction<ViolationAndReward[]>) => {
      state.value = action.payload;
    },
    addViolation: (state, action: PayloadAction<ViolationAndReward>) => {
      state.value.push(action.payload);
    },
    updateViolation: (state, action: PayloadAction<ViolationAndReward>) => {
      state.value = state.value.map((violation) =>
        violation.id === action.payload.id ? action.payload : violation,
      );
    },
    deleteViolation: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter(
        (violation) => violation.id !== action.payload,
      );
    },
  },
});

export const { addViolation, setViolations, updateViolation, deleteViolation } =
  violationSlice.actions;
export default violationSlice.reducer;
