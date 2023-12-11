import { Invoice } from "@/entities/Invoice";
import { faker } from "@faker-js/faker";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { format } from "date-fns";

function getNewInvoice(): Invoice {
  return {
    id: faker.number.int(),
    discountValue: 0,
    customerId: null,
    cash: 0,
    changed: 0,
    subTotal: 0,
    total: 0,
    discountCode: "",
    note: "",
    paymentMethod: "Cash",
    createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    invoiceDetails: [],
  };
}

export const invoicesSlice = createSlice({
  name: "invoices",
  initialState: {
    value: [getNewInvoice()] as Invoice[],
  },
  reducers: {
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.value.push(action.payload);
    },
    createNewInvoice: (state) => {
      const newInvoice: Invoice = getNewInvoice();
      state.value.push(newInvoice);
    },
    deleteInvoice: (state, action: PayloadAction<number>) => {
      const newValue = state.value.filter(
        (invoice) => invoice.id !== action.payload,
      );

      if (newValue.length === 0) newValue.push(getNewInvoice());
      state.value = newValue;
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const payload = action.payload;
      payload.subTotal = payload.invoiceDetails
        .map((v) => v.price * v.quantity)
        .reduce((prev, cur) => prev + cur, 0);
      payload.total = payload.subTotal - payload.discountValue;
      payload.cash = payload.total;

      state.value = state.value.map((invoice) => {
        if (invoice.id === payload.id) return payload;
        else return invoice
      });
    },
  },
});

export const { createNewInvoice, deleteInvoice, updateInvoice, addInvoice } =
  invoicesSlice.actions;
export default invoicesSlice.reducer;
