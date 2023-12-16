import { Invoice } from "@/entities/Invoice";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const invoicesSlice = createSlice({
  name: "invoices",
  initialState: {
    value: [] as Invoice[],
  },
  reducers: {
    setInvoices: (state, action: PayloadAction<Invoice[]>) => {
      state.value = action.payload
    },
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.value.push(action.payload);
    },
    deleteInvoice: (state, action: PayloadAction<number>) => {
      const newValue = state.value.filter(
        (invoice) => invoice.id !== action.payload,
      );

      state.value = newValue;
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      state.value = state.value.map((invoice) => {
        return invoice.id === action.payload.id ? action.payload : invoice
      })
    },
  },
});

export const { setInvoices, deleteInvoice, updateInvoice, addInvoice } =
  invoicesSlice.actions;
export default invoicesSlice.reducer;
