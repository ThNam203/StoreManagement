import { DamagedItemDocument } from "@/entities/DamagedItemDocument";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const damagedItemsSlice = createSlice({
  name: "damagedItemDocuments",
  initialState: {
    value: [] as DamagedItemDocument[],
  },
  reducers: {
    setDamagedItemDocuments: (
      state,
      action: PayloadAction<DamagedItemDocument[]>,
    ) => {
      state.value = action.payload;
    },
    addDamagedItemDocument: (
      state,
      action: PayloadAction<DamagedItemDocument>,
    ) => {
      state.value.push(action.payload);
    },
    deleteDamagedItemDocument: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((check) => check.id !== action.payload);
    },
    updateDamagedItemDocument: (
      state,
      action: PayloadAction<DamagedItemDocument>,
    ) => {
      state.value = state.value.map((invoice) =>
        invoice.id === action.payload.id ? action.payload : invoice,
      );
    },
  },
});

export const {
  setDamagedItemDocuments,
  addDamagedItemDocument,
  deleteDamagedItemDocument,
  updateDamagedItemDocument,
} = damagedItemsSlice.actions;
export default damagedItemsSlice.reducer;
