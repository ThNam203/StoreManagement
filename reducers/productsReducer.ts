import { Product } from "@/entities/Product";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const updateActiveProducts = (products: Product[]) => {
  return products.filter((product) => product.status === "Active" && !product.isDeleted);
}

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    value: [] as Product[],
    activeProducts: [] as Product[],
  },
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.value = action.payload;
      state.activeProducts = updateActiveProducts(action.payload)
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.value.push(action.payload);
      state.activeProducts = updateActiveProducts(state.value)
    },
    addProducts: (state, action: PayloadAction<Product[]>) => {
      action.payload.forEach((product) => state.value.push(product));
      state.activeProducts = updateActiveProducts(state.value)
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((product) => product.id !== action.payload);
      state.activeProducts = updateActiveProducts(state.value)
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      state.value = state.value.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
      state.activeProducts = updateActiveProducts(state.value)
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
