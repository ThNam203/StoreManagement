import { ProductGroup } from "@/entities/Product";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const productGroupsSlice = createSlice({
  name: "productGroups",
  initialState: {
    value: [] as ProductGroup[],
  },
  reducers: {
    setGroups: (state, action: PayloadAction<ProductGroup[]>) => {
      state.value = action.payload;
    },
    addGroup: (state, action: PayloadAction<ProductGroup>) => {
      state.value.push(action.payload);
    },
    addGroups: (state, action: PayloadAction<ProductGroup[]>) => {
      action.payload.forEach((product) => state.value.push(product));
    },
    deleteGroup: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((product) => product.id !== action.payload);
    },
    updateGroup: (state, action: PayloadAction<ProductGroup>) => {
      state.value = state.value.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
    },
  },
});

export const { setGroups, addGroup, addGroups, deleteGroup, updateGroup } =
  productGroupsSlice.actions;
export default productGroupsSlice.reducer;
