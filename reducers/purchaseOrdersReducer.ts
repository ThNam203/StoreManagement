import { PurchaseOrder } from "@/entities/PurchaseOrder";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const purchaseOrdersSlice = createSlice({
  name: "purchaseOrders",
  initialState: {
    value: [] as PurchaseOrder[],
  },
  reducers: {
    setPurchaseOrders: (state, action: PayloadAction<PurchaseOrder[]>) => {
      state.value = action.payload;
    },
    addPurchaseOrder: (state, action: PayloadAction<PurchaseOrder>) => {
      state.value.push(action.payload);
    },
    deletePurchaseOrder: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((check) => check.id !== action.payload);
    },
    updatePurchaseOrder: (state, action: PayloadAction<PurchaseOrder>) => {
      state.value = state.value.map((invoice) =>
        invoice.id === action.payload.id ? action.payload : invoice,
      );
    },
  },
});

export const {
  setPurchaseOrders,
  addPurchaseOrder,
  deletePurchaseOrder,
  updatePurchaseOrder,
} = purchaseOrdersSlice.actions;
export default purchaseOrdersSlice.reducer;
