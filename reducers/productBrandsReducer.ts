import { ProductBrand } from "@/entities/Product";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const productBrandsSlice = createSlice({
  name: "productBrands",
  initialState: {
    value: [] as ProductBrand[],
  },
  reducers: {
    setBrands: (state, action: PayloadAction<ProductBrand[]>) => {
      state.value = action.payload;
    },
    addBrand: (state, action: PayloadAction<ProductBrand>) => {
      state.value.push(action.payload);
    },
    addBrands: (state, action: PayloadAction<ProductBrand[]>) => {
      action.payload.forEach((product) => state.value.push(product));
    },
    deleteBrand: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((product) => product.id !== action.payload);
    },
    updateBrand: (state, action: PayloadAction<ProductBrand>) => {
      state.value = state.value.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
    },
  },
});

export const {
  setBrands,
  addBrand,
  addBrands,
  deleteBrand,
  updateBrand,
} = productBrandsSlice.actions;
export default productBrandsSlice.reducer;
