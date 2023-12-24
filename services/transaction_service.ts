import AxiosService from "./axios_service";
import { Stranger, Transaction } from "@/entities/Transaction";

const getAllExpenseForms = () => {
  return AxiosService.get<Transaction[]>("api/expenses");
};
const createNewExpenseForm = (data: any) => {
  return AxiosService.post<Transaction>("api/expenses", data);
};
const updateExpenseForm = (id: any, data: any) => {
  return AxiosService.put<Transaction>("api/expenses/" + id, data);
};
const deleteExpenseForm = (id: any) => {
  return AxiosService.delete("api/expenses/" + id);
};
const getAllReceiptForms = () => {
  return AxiosService.get<Transaction[]>("api/receipts");
};
const createNewReceiptForm = (data: any) => {
  return AxiosService.post<Transaction>("api/receipts", data);
};
const updateReceiptForm = (id: any, data: any) => {
  return AxiosService.put<Transaction>("api/receipts/" + id, data);
};
const deleteReceiptForm = (id: any) => {
  return AxiosService.delete("api/receipts/" + id);
};

const getAllStrangers = () => {
  return AxiosService.get<Stranger[]>("/api/strangers");
};

const createNewStranger = (data: any) => {
  return AxiosService.post<Stranger>("/api/strangers", data);
};
const updateStranger = (id: any, data: any) => {
  return AxiosService.put<Stranger>("/api/strangers/" + id, data);
};
const deleteStranger = (id: any) => {
  return AxiosService.delete("/api/strangers/" + id);
};
const TransactionService = {
  getAllExpenseForms,
  createNewExpenseForm,
  updateExpenseForm,
  deleteExpenseForm,
  getAllReceiptForms,
  createNewReceiptForm,
  updateReceiptForm,
  deleteReceiptForm,
  getAllStrangers,
  createNewStranger,
  updateStranger,
  deleteStranger,
};
export default TransactionService;
