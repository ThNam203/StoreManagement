import { StockCheck } from "@/entities/StockCheck";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const stockChecksSlice = createSlice({
  name: "stockChecks",
  initialState: {
    value: [] as StockCheck[],
  },
  reducers: {
    setStockChecks: (state, action: PayloadAction<StockCheck[]>) => {
      state.value = action.payload;
    },
    addStockCheck: (state, action: PayloadAction<StockCheck>) => {
      state.value.push(action.payload);
    },
    deleteStockCheck: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter(
        (check) => check.id !== action.payload
      );
    },
    updateStockCheck: (state, action: PayloadAction<StockCheck>) => {
      state.value = state.value.map((invoice) =>
        invoice.id === action.payload.id ? action.payload : invoice
      );
    },
  },
});

export const { setStockChecks, addStockCheck, deleteStockCheck, updateStockCheck } =
  stockChecksSlice.actions;
export default stockChecksSlice.reducer;
