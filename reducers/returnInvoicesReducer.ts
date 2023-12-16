import { ReturnInvoice } from "@/entities/ReturnInvoice";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const returnInvoicesSlice = createSlice({
  name: "returnInvoices",
  initialState: {
    value: [] as ReturnInvoice[],
  },
  reducers: {
    setReturnInvoices: (state, action: PayloadAction<ReturnInvoice[]>) => {
      state.value = action.payload
    },
    addReturnInvoice: (state, action: PayloadAction<ReturnInvoice>) => {
      state.value.push(action.payload);
    },
    deleteReturnInvoice: (state, action: PayloadAction<number>) => {
      const newValue = state.value.filter(
        (returnInvoice) => returnInvoice.id !== action.payload,
      );

      state.value = newValue;
    },
    updateReturnInvoice: (state, action: PayloadAction<ReturnInvoice>) => {
      state.value = state.value.map((returnInvoice) => {
        return returnInvoice.id === action.payload.id ? action.payload : returnInvoice
      })
    },
  },
});

export const { setReturnInvoices, deleteReturnInvoice, updateReturnInvoice, addReturnInvoice } =
  returnInvoicesSlice.actions;
export default returnInvoicesSlice.reducer;
