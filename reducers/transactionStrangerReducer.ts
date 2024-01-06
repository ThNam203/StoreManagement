import { Stranger } from "@/entities/Transaction";
import { convertStrangerReceived } from "@/utils/transactionApiUtils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const transactionStrangerSlice = createSlice({
  name: "transactionStranger",
  initialState: {
    value: [] as Stranger[],
  },
  reducers: {
    setStrangers: (state, action: PayloadAction<any[]>) => {
      const strangers = action.payload.map((stranger) =>
        convertStrangerReceived(stranger),
      );
      state.value = strangers;
    },
    addStranger: (state, action: PayloadAction<any>) => {
      const stranger = convertStrangerReceived(action.payload);
      state.value.push(stranger);
    },
    updateStranger: (state, action: PayloadAction<any>) => {
      const updatedStranger = convertStrangerReceived(action.payload);
      state.value = state.value.map((stranger) =>
        stranger.id === updatedStranger.id ? updatedStranger : stranger,
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
