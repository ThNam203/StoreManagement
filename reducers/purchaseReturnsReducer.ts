import { PurchaseReturn } from "@/entities/PurchaseReturn";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const purchaseReturnsSlice = createSlice({
  name: "purchaseReturns",
  initialState: {
    value: [] as PurchaseReturn[],
  },
  reducers: {
    setPurchaseReturns: (state, action: PayloadAction<PurchaseReturn[]>) => {
      state.value = action.payload;
    },
    addPurchaseReturn: (state, action: PayloadAction<PurchaseReturn>) => {
      state.value.push(action.payload);
    },
    deletePurchaseReturn: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((check) => check.id !== action.payload);
    },
    updatePurchaseReturn: (state, action: PayloadAction<PurchaseReturn>) => {
      state.value = state.value.map((invoice) =>
        invoice.id === action.payload.id ? action.payload : invoice,
      );
    },
  },
});

export const {
  setPurchaseReturns,
  addPurchaseReturn,
  deletePurchaseReturn,
  updatePurchaseReturn,
} = purchaseReturnsSlice.actions;
export default purchaseReturnsSlice.reducer;
