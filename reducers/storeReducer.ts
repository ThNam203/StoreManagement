import { Store } from "@/entities/Store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const storreSlice = createSlice({
  name: "store",
  initialState: {
    information: null as Store | null,
  },
  reducers: {
    setStoreInformation: (state, action: PayloadAction<Store>) => {
      state.information = action.payload;
    },
    updateStoreInformation: (state, action: PayloadAction<Store>) => {
      state.information = action.payload;
    },
  },
});

export const { setStoreInformation, updateStoreInformation } =
  storreSlice.actions;
export default storreSlice.reducer;
