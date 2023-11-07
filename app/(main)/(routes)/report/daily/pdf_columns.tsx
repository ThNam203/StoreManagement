const saleReportColumnHeaders = {
  transactionId: "Transaction ID",
  time: "Time",
  quantity: "Quantity",
  revenue: "Revenue",
  otherFees: "Other Fees",
  totalSale: "Total Sale",
};
const fundReportColumnHeaders = {
  formId: "Form ID",
  targetName: "Payer/Receiver",
  formType: "Expense/Receipt",
  time: "Time",
};
const goodsReportColumnHeaders = {
  goodsId: "Goods ID",
  goodsName: "Goods Name",
  sellQuantity: "Sell Quantity",
  revenue: "Revenue",
  returnQuantity: "Return Quantity",
  returnValue: "Return Value",
  netRevenue: "Net Revenue",
};

export {
  saleReportColumnHeaders,
  fundReportColumnHeaders,
  goodsReportColumnHeaders,
};
