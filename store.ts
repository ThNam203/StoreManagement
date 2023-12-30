import { configureStore } from "@reduxjs/toolkit";
import preloaderReducer from "./reducers/preloaderReducer";
import productsReducer from "./reducers/productsReducer";
import productBrandsReducer from "./reducers/productBrandsReducer";
import productGroupsReducer from "./reducers/productGroupsReducer";
import productLocationsReducer from "./reducers/productLocationsReducer";
import productPropertiesReducer from "./reducers/productPropertiesReducer";
import invoicesReducer from "./reducers/invoicesReducer";
import staffAccountReducer from "./reducers/staffReducer";
import customersReducer from "./reducers/customersReducer";
import customerGroupsReducer from "./reducers/customerGroupsReducer";
import discountsReducer from "./reducers/discountsReducer";
import shiftReducer from "./reducers/shiftReducer";
import stockChecksReducer from "./reducers/stockChecksReducer";
import staffPositionReducer from "./reducers/staffPositionReducer";
import returnInvoicesReducer from "./reducers/returnInvoicesReducer";
import supplierGroupsReducer from "./reducers/supplierGroupsReducer";
import suppliersReducer from "./reducers/suppliersReducer";
import purchaseOrdersReducer from "./reducers/purchaseOrdersReducer";
import profileReducer from "./reducers/profileReducer";
import transactionStrangerReducer from "./reducers/transactionStrangerReducer";
import transactionReducer from "./reducers/transactionReducer";
import shiftViolationReducer from "./reducers/shiftViolationReducer";
import shiftRewardReducer from "./reducers/shiftRewardReducer";
import purchaseReturnsReducer from "./reducers/purchaseReturnsReducer";
import staffPunishAndRewardReducer from "./reducers/staffPunishAndRewardReducer";
import damagedItemsReducer from "./reducers/damagedItemsReducer";
import roleReducer from "./reducers/roleReducer";

const store = configureStore({
  reducer: {
    preloader: preloaderReducer,
    products: productsReducer,
    productBrands: productBrandsReducer,
    productGroups: productGroupsReducer,
    productLocations: productLocationsReducer,
    productProperties: productPropertiesReducer,
    invoices: invoicesReducer,
    staffs: staffAccountReducer,
    staffPositions: staffPositionReducer,
    shift: shiftReducer,
    customers: customersReducer,
    customerGroups: customerGroupsReducer,
    discounts: discountsReducer,
    stockChecks: stockChecksReducer,
    returnInvoices: returnInvoicesReducer,
    suppliers: suppliersReducer,
    supplierGroups: supplierGroupsReducer,
    purchaseOrders: purchaseOrdersReducer,
    purchaseReturns: purchaseReturnsReducer,
    profile: profileReducer,
    transactionStranger: transactionStrangerReducer,
    transactions: transactionReducer,
    violations: shiftViolationReducer,
    rewards: shiftRewardReducer,
    detailPunishAndBonusList: staffPunishAndRewardReducer,
    damagedItemDocuments: damagedItemsReducer,
    role: roleReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
