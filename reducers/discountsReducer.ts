import { Discount } from "@/entities/Discount";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const discountsSlice = createSlice({
  name: "discounts",
  initialState: {
    value: [] as Discount[],
  },
  reducers: {
    setDiscounts: (state, action: PayloadAction<Discount[]>) => {
      state.value = action.payload;
    },
    addDiscount: (state, action: PayloadAction<Discount>) => {
      state.value.push(action.payload);
    },
    deleteDiscount: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter(
        (invoice) => invoice.id !== action.payload
      );
    },
    updateDiscount: (state, action: PayloadAction<Discount>) => {
      state.value = state.value.map((invoice) =>
        invoice.id === action.payload.id ? action.payload : invoice
      );
    },
  },
});

export const { setDiscounts,
    addDiscount,
    deleteDiscount,
    updateDiscount } =
    discountsSlice.actions;
export default discountsSlice.reducer;
