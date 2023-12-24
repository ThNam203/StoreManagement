import { Stranger } from "@/entities/Transaction";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const transactionStrangerSlice = createSlice({
  name: "transactionStranger",
  initialState: {
    value: [] as Stranger[],
  },
  reducers: {
    setStrangers: (state, action: PayloadAction<Stranger[]>) => {
      state.value = action.payload;
    },
    addStranger: (state, action: PayloadAction<Stranger>) => {
      state.value.push(action.payload);
    },
    updateStranger: (state, action: PayloadAction<Stranger>) => {
      state.value = state.value.map((stranger) =>
        stranger.id === action.payload.id ? action.payload : stranger,
      );
    },
    deleteStranger: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter(
        (stranger) => stranger.id !== action.payload,
      );
    },
  },
});

export const { setStrangers, addStranger, updateStranger, deleteStranger } =
  transactionStrangerSlice.actions;
export default transactionStrangerSlice.reducer;
