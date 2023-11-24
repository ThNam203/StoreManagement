import { ProductProperty } from "@/entities/Product";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const productPropertiesSlice = createSlice({
  name: "productProperties",
  initialState: {
    value: [] as ProductProperty[],
  },
  reducers: {
    setProperties: (state, action: PayloadAction<ProductProperty[]>) => {
      state.value = action.payload;
    },
    addProperty: (state, action: PayloadAction<ProductProperty>) => {
      state.value.push(action.payload);
    },
    addProperties: (state, action: PayloadAction<ProductProperty[]>) => {
      action.payload.forEach((product) => state.value.push(product));
    },
    deleteProperty: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((product) => product.id !== action.payload);
    },
    updateProperty: (state, action: PayloadAction<ProductProperty>) => {
      state.value = state.value.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
    },
  },
});

export const {
  setProperties,
  addProperty,
  addProperties,
  deleteProperty,
  updateProperty,
} = productPropertiesSlice.actions;
export default productPropertiesSlice.reducer;
