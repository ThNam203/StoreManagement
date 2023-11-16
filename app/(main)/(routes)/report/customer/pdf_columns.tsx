const saleByCustomerColumnHeaders = {
  id: "Customer ID",
  customerName: "Customer",
  revenue: "Revenue",
  returnValue: "Return value",
  netRevenue: "Net revenue",
};
const profitByCustomerColumnHeaders = {
  customer: "Customer",
  totalRevenue: "Total revenue",
  discount: "Discount",
  revenue: "Revenue",
  returnValue: "Return value",
  netRevenue: "Net revenue",
  totalCost: "Total cost",
  profit: "Profit",
};
const debtByCustomerColumnHeaders = {
  id: "Customer ID",
  customerName: "Customer",
  beginningDebt: "Beginning Debt",
  recordDebt: "Record Debt",
  endingDebt: "Ending Debt",
};

export {
  profitByCustomerColumnHeaders,
  debtByCustomerColumnHeaders,
  saleByCustomerColumnHeaders,
};
