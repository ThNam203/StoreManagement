import { PurchaseOrder } from "@/entities/PurchaseOrder";
import { Sex, Staff } from "@/entities/Staff";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const purchaseOrdersSlice = createSlice({
  name: "profile",
  initialState: {
    value: null as Staff | null,
  },
  reducers: {
    setProfile: (state, action: PayloadAction<Staff>) => {
      state.value = action.payload;
    },
  },
});

export const {
  setProfile,
} = purchaseOrdersSlice.actions;
export default purchaseOrdersSlice.reducer;
