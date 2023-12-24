import { DailyShift, Shift, ViolationAndReward } from "@/entities/Attendance";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const rewardSlice = createSlice({
  name: "rewards",
  initialState: {
    value: [] as ViolationAndReward[],
  },
  reducers: {
    setRewards: (state, action: PayloadAction<ViolationAndReward[]>) => {
      state.value = action.payload;
    },
    addReward: (state, action: PayloadAction<ViolationAndReward>) => {
      state.value.push(action.payload);
    },
    updateReward: (state, action: PayloadAction<ViolationAndReward>) => {
      state.value = state.value.map((reward) =>
        reward.id === action.payload.id ? action.payload : reward,
      );
    },
    deleteReward: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter(
        (reward) => reward.id !== action.payload,
      );
    },
  },
});

export const { addReward, setRewards, updateReward, deleteReward } =
  rewardSlice.actions;
export default rewardSlice.reducer;
