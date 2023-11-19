import { Product } from "@/entities/Product";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: Product[] = [];

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    value: [] as Product[],
  },
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.value = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.value.push(action.payload);
    },
    addProducts: (state, action: PayloadAction<Product[]>) => {
      action.payload.forEach((product) => state.value.push(product));
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((product) => product.id !== action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      state.value = state.value.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
    },
  },
});

export const {
  setProducts,
  addProduct,
  addProducts,
  deleteProduct,
  updateProduct,
} = productsSlice.actions;
export default productsSlice.reducer;
