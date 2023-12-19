import { Supplier } from "@/entities/Supplier";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const suppliersSlice = createSlice({
  name: "suppliers",
  initialState: {
    value: [] as Supplier[],
  },
  reducers: {
    setSuppliers: (state, action: PayloadAction<Supplier[]>) => {
      state.value = action.payload;
    },
    addSupplier: (state, action: PayloadAction<Supplier>) => {
      state.value.push(action.payload);
    },
    deleteSupplier: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter(
        (invoice) => invoice.id !== action.payload
      );
    },
    updateSupplier: (state, action: PayloadAction<Supplier>) => {
      state.value = state.value.map((invoice) =>
        invoice.id === action.payload.id ? action.payload : invoice
      );
    },
  },
});

export const { setSuppliers, addSupplier, deleteSupplier, updateSupplier } =
suppliersSlice.actions;
export default suppliersSlice.reducer;
