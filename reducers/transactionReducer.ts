import { Stranger, Transaction } from "@/entities/Transaction";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    value: [] as Transaction[],
  },
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.value = action.payload;
    },
    addTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.value = [...state.value, ...action.payload];
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.value.push(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      state.value = state.value.map((transaction) =>
        transaction.id === action.payload.id ? action.payload : transaction,
      );
    },
    deleteTransaction: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter(
        (transaction) => transaction.id !== action.payload,
      );
    },
  },
});

export const {
  addTransaction,
  addTransactions,
  setTransactions,
  updateTransaction,
  deleteTransaction,
} = transactionSlice.actions;
export default transactionSlice.reducer;
