import { CustomerGroup } from "@/entities/Customer";
import { SupplierGroup } from "@/entities/Supplier";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const supplierGroupsSlice = createSlice({
  name: "supplierGroups",
  initialState: {
    value: [] as SupplierGroup[],
  },
  reducers: {
    setSupplierGroups: (state, action: PayloadAction<SupplierGroup[]>) => {
      state.value = action.payload;
    },
    addSupplierGroup: (state, action: PayloadAction<SupplierGroup>) => {
      state.value.push(action.payload);
    },
    addSupplierGroups: (state, action: PayloadAction<SupplierGroup[]>) => {
      action.payload.forEach((product) => state.value.push(product));
    },
    deleteSupplierGroup: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter(
        (product) => product.id !== action.payload,
      );
    },
    updateSupplierGroup: (state, action: PayloadAction<SupplierGroup>) => {
      state.value = state.value.map((product) =>
        product.id === action.payload.id ? action.payload : product,
      );
    },
  },
});

export const {
  setSupplierGroups,
  addSupplierGroup,
  addSupplierGroups,
  deleteSupplierGroup,
  updateSupplierGroup,
} = supplierGroupsSlice.actions;
export default supplierGroupsSlice.reducer;
