import { ProductLocation } from "@/entities/Product";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const productLocationsSlice = createSlice({
  name: "productLocations",
  initialState: {
    value: [] as ProductLocation[],
  },
  reducers: {
    setLocations: (state, action: PayloadAction<ProductLocation[]>) => {
      state.value = action.payload;
    },
    addLocation: (state, action: PayloadAction<ProductLocation>) => {
      state.value.push(action.payload);
    },
    addLocations: (state, action: PayloadAction<ProductLocation[]>) => {
      action.payload.forEach((product) => state.value.push(product));
    },
    deleteLocation: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((product) => product.id !== action.payload);
    },
    updateLocation: (state, action: PayloadAction<ProductLocation>) => {
      state.value = state.value.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
    },
  },
});

export const {
  setLocations,
  addLocation,
  addLocations,
  deleteLocation,
  updateLocation,
} = productLocationsSlice.actions;
export default productLocationsSlice.reducer;
