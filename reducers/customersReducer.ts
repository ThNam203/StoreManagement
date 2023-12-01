import { Customer } from "@/entities/Customer";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const customersSlice = createSlice({
  name: "customers",
  initialState: {
    value: [] as Customer[],
  },
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.value = action.payload;
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.value.push(action.payload);
    },
    deleteCustomer: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter(
        (invoice) => invoice.id !== action.payload
      );
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      state.value = state.value.map((invoice) =>
        invoice.id === action.payload.id ? action.payload : invoice
      );
    },
  },
});

export const { setCustomers, addCustomer, deleteCustomer, updateCustomer } =
  customersSlice.actions;
export default customersSlice.reducer;
