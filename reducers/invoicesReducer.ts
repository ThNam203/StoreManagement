import { Invoice } from "@/entities/Invoice";
import { faker } from "@faker-js/faker";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { format } from "date-fns";

function getNewInvoice(): Invoice {
  return {
    id: faker.number.int(),
    discount: 0,
    cash: 0,
    changed: 0,
    subTotal: 0,
    total: 0,
    paymentMethod: "Cash",
    createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    invoiceDetails: [],
  }
}

export const invoicesSlice = createSlice({
  name: "invoices",
  initialState: {
    value: [getNewInvoice()] as Invoice[],
  },
  reducers: {
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.value.push(action.payload)
    },
    createNewInvoice: (state, action) => {
      const newInvoice: Invoice = getNewInvoice();
      state.value.push(newInvoice);
    },
    deleteInvoice: (state, action: PayloadAction<number>) => {
      const newValue = state.value.filter(
        (invoice) => invoice.id !== action.payload
      );

      if (newValue.length === 0) newValue.push(getNewInvoice())
      state.value = newValue
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const payload = action.payload
      action.payload.subTotal = payload.invoiceDetails.map((v) => v.price * v.quantity).reduce((prev, cur) => prev + cur, 0)
      action.payload.total = action.payload.subTotal

      state.value = state.value.map((invoice) =>
        invoice.id === action.payload.id ? action.payload : invoice
      );
    },
  },
});

export const { createNewInvoice, deleteInvoice, updateInvoice, addInvoice } =
  invoicesSlice.actions;
export default invoicesSlice.reducer;
