import { FormType, Stranger, Transaction } from "@/entities/Transaction";
import { formatID } from "@/utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    value: [] as Transaction[],
  },
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.value = action.payload.map((transaction) => {
        const formatId =
          transaction.formType === FormType.EXPENSE
            ? formatID(transaction.id, "EF")
            : formatID(transaction.id, "RF");
        return {
          ...transaction,
          id: formatId,
        };
      });
    },
    addTransactions: (state, action: PayloadAction<Transaction[]>) => {
      const formattedTransactions = action.payload.map((transaction) => {
        const formatId =
          transaction.formType === FormType.EXPENSE
            ? formatID(transaction.id, "EF")
            : formatID(transaction.id, "RF");
        return {
          ...transaction,
          id: formatId,
        };
      });
      state.value = [...state.value, ...formattedTransactions];
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.value.push({
        ...action.payload,
        id: formatID(
          action.payload.id,
          action.payload.formType === FormType.EXPENSE ? "EF" : "RF",
        ),
      });
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const formattedId = formatID(
        action.payload.id,
        action.payload.formType === FormType.EXPENSE ? "EF" : "RF",
      );
      const formatted = { ...action.payload, id: formattedId };
      state.value = state.value.map((transaction) =>
        transaction.id === formattedId ? formatted : transaction,
      );
    },
    deleteTransaction: (
      state,
      action: PayloadAction<{ id: number; type: FormType }>,
    ) => {
      const formatId = formatID(
        action.payload.id,
        action.payload.type === FormType.EXPENSE ? "EF" : "RF",
      );
      state.value = state.value.filter(
        (transaction) => transaction.id !== formatId,
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
