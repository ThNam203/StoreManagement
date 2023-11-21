import { configureStore } from "@reduxjs/toolkit";
import preloaderReducer from "./reducers/preloaderReducer";
import productsReducer from "./reducers/productsReducer";
import productBrandsReducer from "./reducers/productBrandsReducer";
import productGroupsReducer from "./reducers/productGroupsReducer";
import productLocationsReducer from "./reducers/productLocationsReducer";
import productPropertiesReducer from "./reducers/productPropertiesReducer";
import invoicesReducer from "./reducers/invoicesReducer";

const store = configureStore({
  reducer: {
    preloader: preloaderReducer,
    products: productsReducer,
    productBrands: productBrandsReducer,
    productGroups: productGroupsReducer,
    productLocations: productLocationsReducer,
    productProperties: productPropertiesReducer,
    invoices: invoicesReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
