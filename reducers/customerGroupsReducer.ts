import { CustomerGroup } from "@/entities/Customer";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const customerGroupsSlice = createSlice({
  name: "customerGroups",
  initialState: {
    value: [] as CustomerGroup[],
  },
  reducers: {
    setCustomerGroups: (state, action: PayloadAction<CustomerGroup[]>) => {
      state.value = action.payload;
    },
    addCustomerGroup: (state, action: PayloadAction<CustomerGroup>) => {
      state.value.push(action.payload);
    },
    addCustomerGroups: (state, action: PayloadAction<CustomerGroup[]>) => {
      action.payload.forEach((product) => state.value.push(product));
    },
    deleteCustomerGroup: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter(
        (product) => product.id !== action.payload
      );
    },
    updateCustomerGroup: (state, action: PayloadAction<CustomerGroup>) => {
      state.value = state.value.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
    },
  },
});

export const {
  setCustomerGroups,
  addCustomerGroup,
  addCustomerGroups,
  deleteCustomerGroup,
  updateCustomerGroup,
} = customerGroupsSlice.actions;
export default customerGroupsSlice.reducer;
